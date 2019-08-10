<template>
	<div class="puzzle-container" v-show="isVerificationShow">
		<div class="puzzle-header">
			<span class="puzzle-header-left">拖动下方滑块完成拼图</span>
			<div>
				<span class="re-btn iconfont icon-shuaxin" @click="refreshImg"></span>
				<span class="close-btn iconfont icon-guanbi" @click="closeVerificationBox"></span>
			</div>
		</div>
		<div :style="'position:relative;overflow:hidden;width:'+ dataWidth +'px;'">
			<div :style="'position:relative;width:' + dataWidth + 'px;height:' + dataHeight + 'px;'">
				<img
					id="scream"
					ref="scream"
					:src="imgRandom"
					:style="'width:' + dataWidth + 'px;height:' + dataHeight + 'px;'"
				/>
				<canvas id="puzzle-box" ref="puzzleBox" :width="dataWidth" :height="dataHeight"></canvas>
			</div>
			<div
				class="puzzle-lost-box"
				:style="'left:' + left_Num + 'px;width:' + dataWidth + 'px;height:' + dataHeight + 'px;'"
			>
				<canvas id="puzzle-shadow" ref="puzzleShadow" :width="dataWidth" :height="dataHeight"></canvas>
				<canvas id="puzzle-lost" ref="puzzleLost" :width="dataWidth" :height="dataHeight"></canvas>
			</div>
			<p :class="'ver-tips'+ (displayTips ? ' slider-tips' : '')" ref="verTips">
				<template v-if="verification">
					<i style="background-position:-4px -1207px;"></i>
					<span style="color:#42ca6b;">验证通过</span>
					<span></span>
				</template>
				<template v-if="!verification">
					<i style="background-position:-4px -1229px;"></i>
					<span style="color:red;">验证失败:</span>
					<span style="margin-left:4px;">拖动滑块将悬浮图像正确拼合</span>
				</template>
			</p>
		</div>

		<div class="slider-container" :style="'width:' + dataWidth + 'px;'">
			<div class="slider-bar"></div>
			<div class="slider-btn" ref="sliderBtn" @mousedown="startMove" @touchstart="startMove"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: "puzzleVerification",
	data() {
		return {
      isVerificationShow: false,
			moveStart: "",
			displayTips: false,
			verification: false,
			randomX: null,
			randomY: null,
			imgRandom: "",
			left_Num: 0,
			dataWidth: null,
			dataHeight: null,
			puzzleSize: null, // 滑块的大小
			deviationValue: null,
      radius: null,
      padding: null
		};
  },
  model: {
    prop: 'verificationShow',
    event: 'setVisible'
  },
  watch: {
    isVerificationShow(val) {
      this.$emit('setVisible', val);
    },
    verificationShow(val) {
      this.isVerificationShow = val;
    }
  },
	props: {
    // 画布图片的尺寸
		width: {
			type: [String, Number],
			default: 260
		},
		height: {
			type: [String, Number],
			default: 120
    },
    // 图集
		puzzleImgList: {
			type: Array,
			default: () => [
				"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551244602306&di=5b40d29f1de52815d2643ce3eb3f6d3b&imgtype=0&src=http%3A%2F%2Fimg1.3lian.com%2F2015%2Fa1%2F38%2Fd%2F168.jpg",
				"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551244644208&di=3f09dbe3476994f15ed207e4d0c008ef&imgtype=0&src=http%3A%2F%2Fpic3.16pic.com%2F00%2F47%2F90%2F16pic_4790939_b.jpg",
				"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551244821054&di=bf03257cfaf9d0a0f020e7f1363cf5f8&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F15%2F11%2F96%2F88W58PIC7Y2_1024.jpg"
			]
    },
    // 滑块的大小
		blockSize: {
			type: [String, Number],
			default: 40
    },
    // 误差
		deviation: {
			type: [String, Number],
			default: 4
    },
    // 滑块的圆角大小
    blockRadius: {
      type: [String, Number],
      default: 4
    },
    // 滑块随机出现的范围
		wraperPadding: {
			type: [String, Number],
			default: 20
    },
    // 滑块形状 square  puzzle
    blockType: {
      type: String,
      default: 'square'
    },
    // 成功的回调
		onSuccess: {
			type: Function,
			default: () => {
				console.log("成功");
			}
    },
    // 失败的回调
		onError: {
			type: Function,
			default: () => {
				console.log("失败");
			}
    },
    verificationShow: {
      type: Boolean,
      default: false
    }
	},
	mounted() {
		this.$nextTick(() => {
			this.initCanvas();
		});
	},
	created() {
    // 随机显示一张图片
		let imgRandomIndex = Math.round(
			Math.random() * (this.puzzleImgList.length - 1)
		);
    this.imgRandom = this.puzzleImgList[imgRandomIndex];
    
		this.puzzleSize = Number(this.blockSize);
    this.deviationValue = Number(this.deviation);
    this.radius = Number(this.blockRadius);
    this.dataWidth = Number(this.width);
    this.dataHeight = Number(this.height);
    this.padding = Number(this.wraperPadding);
	},
	methods: {
    /* 关闭验证 */
    closeVerificationBox() {
      this.isVerificationShow = false;
    },
		/* 刷新 */
		refreshImg() {
			let imgRandomIndex = Math.round(
				Math.random() * (this.puzzleImgList.length - 1)
			);
			this.imgRandom = this.puzzleImgList[imgRandomIndex];
			this.initCanvas();
		},
		/* 画布初始化 */
		initCanvas() {
			this.clearCanvas();
			let w = this.dataWidth;
			let h = this.dataHeight;
			let PL_Size = this.puzzleSize;
			let padding = this.padding;
			let MinN_X = padding + PL_Size;
			let MaxN_X = w - padding - PL_Size - PL_Size / 6;
			let MaxN_Y = padding;
			let MinN_Y = h - padding - PL_Size - PL_Size / 6;
			this.randomX = Math.round(Math.random() * (MaxN_X - PL_Size) + MinN_X);
			this.randomY = Math.round(Math.random() * MaxN_Y + MinN_Y);
			let X = this.randomX;
			let Y = this.randomY;
			this.left_Num = -X + 10;
			let d = PL_Size / 3;
			let radius = Number(this.radius);

			let c = this.$refs.puzzleBox;
			let c_l = this.$refs.puzzleLost;
			let c_s = this.$refs.puzzleShadow;
			let ctx = c.getContext("2d");
			let ctx_l = c_l.getContext("2d");
			let ctx_s = c_s.getContext("2d");
			ctx.globalCompositeOperation = "xor";
			ctx.shadowBlur = 10;
			ctx.shadowColor = "#fff";
			ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 3;
			ctx.fillStyle = "rgba(0,0,0,0.7)";
			ctx.beginPath();
			ctx.lineWidth = "1";
      ctx.strokeStyle = "rgba(0,0,0,0)";
      if (this.blockType === 'square') {
        ctx.arc(X + radius, Y + radius, radius, Math.PI, (Math.PI * 3) / 2);
        ctx.lineTo(PL_Size - radius + X, Y);
        ctx.arc(
          PL_Size - radius + X,
          radius + Y,
          radius,
          (Math.PI * 3) / 2,
          Math.PI * 2
        );
        ctx.lineTo(PL_Size + X, PL_Size + Y - radius);
        ctx.arc(
          PL_Size - radius + X,
          PL_Size - radius + Y,
          radius,
          0,
          (Math.PI * 1) / 2
        );
        ctx.lineTo(radius + X, PL_Size + Y);
        ctx.arc(
          radius + X,
          PL_Size - radius + Y,
          radius,
          (Math.PI * 1) / 2,
          Math.PI
        );
      } else {
        ctx.moveTo(X, Y)
        ctx.lineTo(X + d, Y)
        ctx.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
        ctx.lineTo(X + 3 * d, Y)
        ctx.lineTo(X + 3 * d, Y + d)
        ctx.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
        ctx.lineTo(X + 3 * d, Y + 3 * d)
        ctx.lineTo(X, Y + 3 * d)
      }
			ctx.closePath();
			ctx.stroke();
			ctx.fill();

			let img = new Image();
			img.src = this.imgRandom;

			img.onload = function() {
				ctx_l.drawImage(img, 0, 0, w, h);
			};
			ctx_l.beginPath();
      ctx_l.strokeStyle = "rgba(0,0,0,0)";
      if (this.blockType === 'square') {
        ctx_l.arc(X + radius, Y + radius, radius, Math.PI, (Math.PI * 3) / 2);
        ctx_l.lineTo(PL_Size - radius + X, Y);
        ctx_l.arc(
          PL_Size - radius + X,
          radius + Y,
          radius,
          (Math.PI * 3) / 2,
          Math.PI * 2
        );
        ctx_l.lineTo(PL_Size + X, PL_Size + Y - radius);
        ctx_l.arc(
          PL_Size - radius + X,
          PL_Size - radius + Y,
          radius,
          0,
          (Math.PI * 1) / 2
        );
        ctx_l.lineTo(radius + X, PL_Size + Y);
        ctx_l.arc(
          radius + X,
          PL_Size - radius + Y,
          radius,
          (Math.PI * 1) / 2,
          Math.PI
        );
      } else {
        ctx_l.moveTo(X, Y)
        ctx_l.lineTo(X + d, Y)
        ctx_l.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
        ctx_l.lineTo(X + 3 * d, Y)
        ctx_l.lineTo(X + 3 * d, Y + d)
        ctx_l.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
        ctx_l.lineTo(X + 3 * d, Y + 3 * d)
        ctx_l.lineTo(X, Y + 3 * d)
      }
			ctx_l.closePath();
			ctx_l.stroke();
			ctx_l.shadowBlur = 10;
			ctx_l.shadowColor = "black";
			ctx_l.clip();
			ctx_s.beginPath();
			ctx_s.lineWidth = "1";
      ctx_s.strokeStyle = "rgba(0,0,0,0)";
      if (this.blockType === 'square') {
        ctx_s.arc(X + radius, Y + radius, radius, Math.PI, (Math.PI * 3) / 2);
        ctx_s.lineTo(PL_Size - radius + X, Y);
        ctx_s.arc(
          PL_Size - radius + X,
          radius + Y,
          radius,
          (Math.PI * 3) / 2,
          Math.PI * 2
        );
        ctx_s.lineTo(PL_Size + X, PL_Size + Y - radius);
        ctx_s.arc(
          PL_Size - radius + X,
          PL_Size - radius + Y,
          radius,
          0,
          (Math.PI * 1) / 2
        );
        ctx_s.lineTo(radius + X, PL_Size + Y);
        ctx_s.arc(
          radius + X,
          PL_Size - radius + Y,
          radius,
          (Math.PI * 1) / 2,
          Math.PI
        );
      } else {
        ctx_s.moveTo(X, Y)
        ctx_s.lineTo(X + d, Y)
        ctx_s.bezierCurveTo(X + d, Y - d, X + 2 * d, Y - d, X + 2 * d, Y)
        ctx_s.lineTo(X + 3 * d, Y)
        ctx_s.lineTo(X + 3 * d, Y + d)
        ctx_s.bezierCurveTo(X + 2 * d, Y + d, X + 2 * d, Y + 2 * d, X + 3 * d, Y + 2 * d)
        ctx_s.lineTo(X + 3 * d, Y + 3 * d)
        ctx_s.lineTo(X, Y + 3 * d)
      }
			ctx_s.closePath();
			ctx_s.stroke();
			ctx_s.shadowBlur = 20;
			ctx_s.shadowColor = "black";
			ctx_s.fill();
		},
		/* 通过重置画布尺寸清空画布，这种方式更彻底 */
		clearCanvas() {
			let c = this.$refs.puzzleBox;
			let c_l = this.$refs.puzzleLost;
			let c_s = this.$refs.puzzleShadow;
			c.setAttribute("height", c.getAttribute("height"));
			c_l.setAttribute("height", c.getAttribute("height"));
			c_s.setAttribute("height", c.getAttribute("height"));
		},
		/* 按住滑块后初始化移动监听，记录初始位置 */
		startMove(e) {
			// console.log(e);
			e = e || window.event;
			this.$refs.sliderBtn.style.backgroundPosition = "0 -216px";
			this.moveStart = e.pageX || e.targetTouches[0].pageX;
			this.addMouseMoveListener();
		},
		/* 滑块移动 */
		moving(e) {
			let self = this;
			e = e || window.event;
			let moveX = e.pageX || e.targetTouches[0].pageX;
			let d = moveX - self.moveStart;
			let w = self.dataWidth;
			let PL_Size = this.puzzleSize;
			let padding = this.padding;
			if (self.moveStart === "") {
				return "";
			}
			if (d < 0 || d > w - padding - PL_Size) {
				return "";
			}
			self.$refs.sliderBtn.style.left = d + "px";
			self.$refs.sliderBtn.style.transition = "inherit";
			self.$refs.puzzleLost.style.left = d + "px";
			self.$refs.puzzleLost.style.transition = "inherit";
			self.$refs.puzzleShadow.style.left = d + "px";
			self.$refs.puzzleShadow.style.transition = "inherit";
		},
		/* 移动结束，验证并回调 */
		moveEnd(e) {
			let self = this;
			e = e || window.event;
			let moveEnd_X = (e.pageX || e.changedTouches[0].pageX) - self.moveStart;
			let ver_Num = self.randomX - 10;
			let deviationValue = this.deviationValue;
			let Min_left = ver_Num - deviationValue;
			let Max_left = ver_Num + deviationValue;
			if (self.moveStart !== "") {
				if (Max_left > moveEnd_X && moveEnd_X > Min_left) {
					self.displayTips = true;
					self.verification = true;
					setTimeout(function() {
						self.displayTips = false;
						self.initCanvas();
						/* 成功的回调函数 */
						self.onSuccess();
					}, 500);
				} else {
					self.displayTips = true;
					self.verification = false;
					setTimeout(function() {
						self.displayTips = false;
						self.initCanvas();
						/* 失败的回调函数 */
						self.onError();
					}, 800);
				}
			}
			if (
				typeof self.$refs.sliderBtn !== "undefined" &&
				typeof self.$refs.puzzleLost !== "undefined" &&
				typeof self.$refs.puzzleShadow !== "undefined"
			) {
				setTimeout(function() {
					self.$refs.sliderBtn.style.left = 0;
					self.$refs.sliderBtn.style.transition = "left 0.5s";
					self.$refs.puzzleLost.style.left = 0;
					self.$refs.puzzleLost.style.transition = "left 0.5s";
					self.$refs.puzzleShadow.style.left = 0;
					self.$refs.puzzleShadow.style.transition = "left 0.5s";
				}, 400);
				self.$refs.sliderBtn.style.backgroundPosition = "0 -84px";
			}
			self.moveStart = "";
		},
		/* 全局绑定滑块移动与滑动结束，移动过程中鼠标可在页面任何位置 */
		addMouseMoveListener() {
			let self = this;
			document.addEventListener("mousemove", self.moving);
			document.addEventListener("touchmove", self.moving);
			document.addEventListener("mouseup", self.moveEnd);
			document.addEventListener("touchend", self.moveEnd);
		}
	},
};
</script>

<style scoped>
.slider-btn {
	position: absolute;
	width: 44px;
	height: 44px;
	left: 0;
	top: -7px;
	z-index: 12;
	cursor: pointer;
	background-image: url(../assets/sprite.3.2.0.png);
	background-position: 0 -84px;
	transition: inherit;
}

.ver-tips {
	position: absolute;
	left: 0;
	bottom: -22px;
	background: rgba(255, 255, 255, 0.9);
	height: 22px;
	line-height: 22px;
	font-size: 12px;
	width: 100%;
	margin: 0;
	text-align: left;
	padding: 0 8px;
	transition: all 0.4s;
}

.slider-tips {
	bottom: 0;
}

.ver-tips i {
	display: inline-block;
	width: 22px;
	height: 22px;
	vertical-align: top;
	background-image: url(../assets/sprite.3.2.0.png);
	background-position: -4px -1229px;
}

.ver-tips span {
	display: inline-block;
	vertical-align: top;
	line-height: 22px;
	color: #455;
}

.active-tips {
	display: block;
}

.hidden {
	display: none;
}

.puzzle-container {
	position: relative;
	display: inline-block;
	padding: 15px 15px 28px;
	border: 1px solid #ddd;
	background: #ffffff;
	border-radius: 16px;
}

.puzzle-header {
	display: flex;
	justify-content: space-between;
	margin: 5px 0;
}

.puzzle-header-left {
	color: #333;
}

.re-btn,
.close-btn {
	font-size: 16px;
	cursor: pointer;
	color: #666;
}

.re-btn:hover {
	color: #67c23a;
}

.close-btn:hover {
	color: #f56c6c;
}

.close-btn {
	margin-left: 5px;
}

.slider-container {
	position: relative;
	margin: 10px auto 0;
	min-height: 15px;
}

.slider-bar {
	height: 10px;
	border: 1px solid #c3c3c3;
	border-radius: 5px;
	background: #e4e4e4;
	box-shadow: 0 1px 1px rgba(12, 10, 10, 0.2) inset;
	position: absolute;
	width: 100%;
	top: 7px;
}

#puzzle-box {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 22;
}

#puzzle-shadow {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 22;
}

#puzzle-lost {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 33;
}

.puzzle-lost-box {
	position: absolute;
	width: 260px;
	height: 116px;
	left: 0;
	top: 0;
	z-index: 111;
}

@font-face {
	font-family: "iconfont";
	src: url("../assets/icon-font/iconfont.eot?t=1565160368550"); /* IE9 */
	src: url("../assets/icon-font/iconfont.eot?t=1565160368550#iefix")
			format("embedded-opentype"),
		/* IE6-IE8 */
			url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAANUAAsAAAAAByQAAAMIAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCfAqCFIIkATYCJAMMCwgABCAFhG0HOhtkBsi+QDw2JxWVhBKVFukepjkT9iz2vr6/fAq8RxAPz4+9O/e9O9WkGj15Fk3LQ/NCJ41QaVASVSzTSJ7E2p//a/4CvASvALwTjbaVddq9o71hlfDegDawAW//1zQFGqAwEaokh6yK8jD/9/c4lxuw3PPkdI3ZegseIJGz/1WKn5AESUiaSApHHzJ2/2uCAT/S0Iz7q0i8eCKrBLgEQJauMPX/uZzeKPH5KSuXuSYd9aI4DiigvbFNViAJeovsrkAs8jyBdmME8ODibgRNyZwWiIdGO9DM+KXkU61Cc8XaFI9p0loe6Q3gNvh+fKdFk6KpMuceX5/7cPTJ/Tfy4spDEIxnBb+JihVAEueV9kOVKL4Ca1dZq6YAKXljibz/PCFRiGZmcSdYIInCJw6Toid+iM6+oYJmd5A8BW4pefDQFKWzc2SkXpr+P1LN9+L/JeF4UsZPUGWa/nUPMypPfme7Do2j785+zvL4Z37s1l/wcAEwhNPJqPMcHgerCdZ/wbrLlYRrg2tSMZ45fpHJLQ7humLaL9WW9r64yBa+7D3UcBOs/3jDHKz7+MTzgPkExVfzZnHa3qveHHJTfVjsFjh5X99QxlP8cdhYHOyY+Fmy4BUXoLG2ngiSbe2xv/AbW/8ptNb3/tiQ4MN+w2saBeoEoFUBLHjnAmBTaiLTUFPhO3zDUa2nvAqYK7g0MN39vv3VQzeXDK2GEihajELVagZN8go06bAKzVptQ7tlzuYOAyoqItuwZIgg9LpC0e05VL1eaJI/0GTYD5r1RgXaXcb2nh3mwiydMjlCPrpPaLwkVrZJlsLSAekidDgtCigT4tyEsCcp+dQlxcRjLMjvdV9EoeIkwgt0GYVhgiknc/KkPRNJdzpyXPWmtpdEsGQfIw5BfMj3BGU8iZjyOoulwucHiFYIObiBUGWfICxnekcqiQJAL+UxiHAt11Td0/pqhIJiLBFBNrKS0IonUKl61BzxiLa0RzS1QyatYqi8Pb8yer5d0M7co0aJGqn5TuHErmnksyD2aGIA")
			format("woff2"),
		url("../assets/icon-font/iconfont.woff?t=1565160368550") format("woff"),
		url("../assets/icon-font/iconfont.ttf?t=1565160368550") format("truetype"),
		/* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
			url("../assets/icon-font/iconfont.svg?t=1565160368550#iconfont")
			format("svg"); /* iOS 4.1- */
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-guanbi:before {
	content: "\f01f1";
}

.icon-shuaxin:before {
	content: "\e609";
}
</style>