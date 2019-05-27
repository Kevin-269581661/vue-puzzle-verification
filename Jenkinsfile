// Jenkinsfile (Declarative Pipeline)
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh '''
                    /usr/bin/cnpm install
                    /usr/bin/cnpm run build
                '''
            }
        }
        stage('Package') {
            steps {
                echo 'Packaging...'
                sh '''
                    /bin/cat /root/.docker/.tencent_hub | /usr/bin/docker login --username=100009920505 --password-stdin ccr.ccs.tencentyun.com
                    /usr/bin/docker build -t ccr.ccs.tencentyun.com/qadn/web:${JOB_NAME##*/}-${BUILD_ID} -f Dockerfile . 
                    /usr/bin/docker push ccr.ccs.tencentyun.com/qadn/web:${JOB_NAME##*/}-${BUILD_ID}
                '''
            }
        }
        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
    }
}