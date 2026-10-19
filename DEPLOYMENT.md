# Social Lite Deployment Guide

## 1. Overview

This deployment demonstrates a basic Social Lite Hello World application running in a Docker container on an AWS EC2 instance. Amazon ECR stores the Docker image, AWS CloudFormation defines the infrastructure, and GitHub Actions automates validation and application testing.

## 2. Application

The application is located in the `hello-world` directory.

- `app.py`: Flask web application.
- `requirements.txt`: Python dependencies.
- `Dockerfile`: Instructions for building the Docker image.

The application provides two endpoints:

- `/`: Returns the Social Lite application response.
- `/health`: Returns the application health status.

## 3. Amazon ECR

The Docker image is stored in the private Amazon ECR repository `social-lite-app`.

Image URI:

`129371411537.dkr.ecr.us-east-1.amazonaws.com/social-lite-app:latest`

To upload an updated image, authenticate Docker with Amazon ECR, tag the image with the repository URI, and push it to the repository. AWS credentials must be valid.

## 4. AWS CloudFormation

The infrastructure template is located at `cloudformation/template.yaml`.

It defines:

- An EC2 security group allowing HTTP traffic on port 80.
- An EC2 instance running the Docker application.
- The existing AWS Academy `LabInstanceProfile`.
- A CloudWatch alarm monitoring EC2 CPU utilisation.
- Stack outputs for the application URL, instance ID, ECR image, and security group ID.

The VPC and public subnet are supplied as parameters when creating or updating the stack.

## 5. GitHub Actions

The workflow is located at `.github/workflows/deploy.yml`.

It runs when relevant deployment files are pushed to the `feature/cloudformation-deployment` branch, and can also be started manually using `workflow_dispatch`.

The workflow performs these checks:

1. Validates the CloudFormation template.
2. Checks the CloudWatch alarm configuration.
3. Tests the deployed application's health endpoint.
4. Checks the application response.

The workflow has been tested successfully. The latest recorded run completed both the CloudFormation validation and deployed-application testing jobs.

**Note:** The current workflow validates the template and tests the running application. It does not automatically create or update the CloudFormation stack, and it does not query CloudWatch alarm state through the AWS API.

## 6. CloudWatch Monitoring

The CloudFormation template defines a CPU utilisation alarm for the EC2 instance. The alarm threshold is 80%, evaluated over two periods of 300 seconds.

The alarm was checked in the AWS account and reported `OK` at the time of verification. This indicates that the alarm was not in an alarm state at that time; it does not guarantee that the application will always be healthy.

## 7. Deployment Verification

The deployed application was tested using:

`curl.exe -v --connect-timeout 5 http://75.101.214.182/health`

The response was HTTP 200 with:

`{"status":"healthy"}`

The GitHub Actions workflow also completed successfully, with both jobs passing.

## 8. AWS Academy Limitations

AWS Academy uses temporary credentials and restricts some IAM operations. Creating an IAM OpenID Connect provider for GitHub Actions was denied in this environment.

As a result, the current setup uses the existing AWS Academy instance profile for the EC2 instance. Automated AWS deployment from GitHub Actions requires suitable AWS permissions and authentication to be configured separately.
