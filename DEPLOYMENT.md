# Social Lite Deployment Guide

## 1. Overview

This part is a basic Hello World app for Social Lite. I used Docker to package the app and AWS to run it on an EC2 instance.

I used Amazon ECR to store the Docker image, CloudFormation to create the AWS resources, and GitHub Actions to test the deployment.

## 2. Application

The app is in the `hello-world` folder.

The main files are:

- `app.py`: Runs the Flask application.
- `requirements.txt`: Lists the Python packages.
- `Dockerfile`: Contains the instructions to build the Docker image.

The app has two endpoints:

- `/`: Shows the main app response.
- `/health`: Checks whether the app is healthy.

## 3. Amazon ECR

I created a private ECR repository called `social-lite-app` to store the Docker image.

Image URI:

`129371411537.dkr.ecr.us-east-1.amazonaws.com/social-lite-app:latest`

To upload an image, I first log in to ECR using AWS credentials. Then I tag the image with the repository URI and push it to ECR.

## 4. CloudFormation

The template is in `cloudformation/template.yaml`. It defines the AWS resources needed to run the app.

### Parameters

- `VpcId`: The existing VPC ID.
- `SubnetId`: The public subnet ID.
- `ImageUri`: The ECR image URI. It has a default value pointing to the Social Lite image.

These values tell CloudFormation which network and Docker image to use.

### Resources

- `AppSecurityGroup`: Allows HTTP traffic through port 80.
- `SocialLiteInstance`: Creates a `t3.micro` EC2 instance to run the app.
- `CPUAlarm`: Monitors the EC2 instance's CPU usage.

The EC2 instance uses the existing AWS Academy `LabInstanceProfile`.

When the instance starts, the `UserData` script installs Docker, logs in to ECR, downloads the image, and starts the container. Port 80 on the instance connects to port 5000 in the container.

### Outputs

The template provides four outputs:

- `AppURL`: The app's public URL.
- `InstanceId`: The EC2 instance ID.
- `ECRImage`: The Docker image URI.
- `SecurityGroupId`: The security group ID.

### Deployment steps

1. Build the Docker image in the `hello-world` folder.
2. Push the image to Amazon ECR.
3. Create or update the CloudFormation stack with the VPC ID, subnet ID, and image URI.
4. Check the stack status in AWS CloudFormation.
5. Open the app URL and test `/` and `/health`.
6. Check the CPU alarm in CloudWatch.

## 5. GitHub Actions

The workflow is in `.github/workflows/deploy.yml`.

It runs when relevant files are pushed to the `feature/cloudformation-deployment` branch. It can also be run manually.

The workflow has three jobs:

1. **Validate CloudFormation:** Checks the template's YAML structure and checks that a CPU alarm is defined.
2. **Smoke test:** Checks the app's health endpoint and main response.
3. **Playwright tests:** Checks the responses from the main and health endpoints.

The jobs run in order, and the next job starts only when its required previous job passes.

## 6. CloudWatch

The template creates a CPU alarm for the EC2 instance.

The threshold is 80% CPU usage. Each evaluation period is 300 seconds, and the alarm checks two evaluation periods.

When I checked the alarm in AWS, its state was `OK`. This means it was not reporting a high-CPU condition at that time.

The current GitHub Actions workflow checks the alarm configuration in the template. It does not automatically check the live alarm state.

## 7. Testing

I tested the app using AWS CloudShell and GitHub Actions.

The `/health` endpoint returned HTTP 200 with:

`{"status":"healthy"}`

The main endpoint returned:

`{"application":"Social Lite","message":"Hello World","status":"running"}`

The latest recorded GitHub Actions run passed the CloudFormation validation, smoke test, and Playwright endpoint tests.

## 8. AWS Academy Limitations

AWS Academy restricts some IAM operations and uses temporary credentials.

I tried to set up an OpenID Connect provider for GitHub Actions, but AWS denied permission to create it. Because of this, my current workflow does not automatically deploy the CloudFormation stack or check the live CloudWatch alarm through the AWS API.

The EC2 instance uses the existing AWS Academy instance profile. To automate deployment fully, I would need an AWS authentication method supported by the lab and the required permissions.
