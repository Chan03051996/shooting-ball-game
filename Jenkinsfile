pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        AWS_ACCESS_KEY_ID = 'test'
        AWS_SECRET_ACCESS_KEY = 'test'
        AWS_ENDPOINT = 'http://floci:4566'
    }

    stages {
	stage('Clean Workspace') {
 	   steps {
        	deleteDir()
    		}
	}

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                sh '''
                    terraform version
                    aws --version
                    docker version
                    python3 --version
                    git --version
                '''
            }
        }

        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                }
            }
        }

        stage('Terraform Validate') {
            steps {
                dir('terraform') {
                    sh 'terraform validate'
                }
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('terraform') {
                    sh 'terraform apply -auto-approve'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t shooting-game:latest .'
            }
        }

        stage('Restart Application') {
 	   steps {
        	sh '''
            	docker rm -f shooting-game || true

            	docker run -d \
              	--name shooting-game \
              	--network shooting-network \
              	-p 5000:5000 \
              	-e AWS_ENDPOINT=http://floci:4566 \
              	shooting-game:latest
        	'''
    		}
	}

        stage('Wait for Application') {
            steps {
                sh 'sleep 15'
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    curl -f http://localhost:5000/health
                '''
            }
        }

        stage('Verify Scores API') {
            steps {
                sh '''
                    curl -f http://localhost:5000/scores
                '''
            }
        }
    }

    post {

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed.'
        }

        always {
            sh 'docker ps'
        }
    }
}
