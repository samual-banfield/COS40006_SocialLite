# Social Lite Deployment Guide

## 1. Overview

This part of the project is a simple Hello World app for Social Lite. I used Docker to package the app and AWS to run it on an EC2 instance.

The Docker image is stored in Amazon ECR. I used CloudFormation to define the AWS resources and GitHub Actions to check the template and test the app.

## 2. Application

The app is in the `hello-world` folder.

The main files are:

- `app.py`: The Flask application.
- `requirements.txt`: The Python packages needed by the app.
- `Dockerfile`: Used to build the Docker image.

There are two endpoints:

- `/`: Returns the Social Lite app response.
- `/health`: Returns the app's health status.

## 3. Amazon ECR

I created a private ECR repository called `social-lite-app` to store the Docker image.

Image URI:

`129371411537.dkr.ecr.us-east-1.amazonaws.com/social-lite-app:latest`

To upload a new image, Docker needs to log in to ECR first. The image can then be tagged with the repository URI and pushed. Valid AWS credentials are required.

## 4. CloudFormation

The template is in `cloudformation/template.yaml`.

It defines the following resources:

- A security group that allows HTTP traffic on port 80.
- An EC2 instance to run the Docker app.
- The existing AWS Academy `LabInstanceProfile`.
- A CloudWatch alarm for EC2 CPU usage.

The template also provides outputs for the app URL, EC2 instance ID, ECR image and security group ID.

The VPC ID and public subnet ID are provided as parameters when creating or updating the stack.

## 5. GitHub Actions

The workflow is in `.github/workflows/deploy.yml`.

It runs when relevant files are pushed to the `feature/cloudformation-deployment` branch. It can also be started manually.

The workflow checks:

1. Whether the CloudFormation template is valid.
2. Whether a CPU alarm is configured in the template.
3. Whether the app's `/health` endpoint responds.
4. Whether the main endpoint returns the expected app response.

The latest recorded workflow run passed both jobs.

## 6. CloudWatch

CloudFormation defines a CPU utilisation alarm for the EC2 instance.

The alarm uses a threshold of 80% CPU utilisation, with two evaluation periods of 300 seconds each.

When I checked the alarm in AWS, its state was `OK`. This means the alarm was not reporting a high-CPU condition at that time.

## 7. Testing

I tested the deployed application using AWS CloudShell.

The health endpoint returned HTTP 200 with:

{"status":"healthy"}

The main endpoint returned:

{"application":"Social Lite","message":"Hello World","status":"running"}

The GitHub Actions workflow also passed its CloudFormation validation and application testing jobs.

## 8. AWS Academy Limitations

AWS Academy uses temporary credentials and restricts some IAM operations.

I tried to set up an OpenID Connect provider for GitHub Actions, but AWS denied permission to create it. Because of this, the current workflow does not automatically deploy the CloudFormation stack or query the CloudWatch alarm through the AWS API.

The EC2 instance uses the existing AWS Academy instance profile. Automated deployment from GitHub Actions would need a supported AWS authentication method and the required permissions.