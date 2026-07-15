pipeline {
    agent any

    environment {
        IMAGE_NAME = "shooting-game"
        CONTAINER_NAME = "shooting-game"
        PORT = "5000"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker rm -f ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker run -d \
                  --name ${CONTAINER_NAME} \
                  -p ${PORT}:5000 \
                  ${IMAGE_NAME}:latest
                '''
            }
        }
	stage('Health Check') {
    		steps {
        	    sh '''
        	    echo "===== Running Containers ====="
                    docker ps

        	    echo "===== Application Logs ====="
        	    docker logs shooting-game
        	    '''
   		 }
	}	
  }

    post {

        success {
            echo "Deployment Successful!"
        }

        failure {
            echo "Deployment Failed!"
        }

        always {
            echo "Pipeline Finished"
        }
    }
}
