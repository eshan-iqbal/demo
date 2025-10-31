# **App Name**: Terraform Pilot

## Core Features:

- AWS Resource Scanning: Scan the user's AWS environment to discover resources such as EC2 instances, S3 buckets, and RDS databases.
- Resource Mapping: Map discovered cloud resources to Terraform state and code, highlighting match percentages and mapping status.
- Security Issue Detection: Identify security issues such as open S3 buckets and outdated EC2 patches, presenting them as interactive issue cards.
- Automated Infrastructure Fixes: Leverage AI to remediate infrastructure issues. Based on findings from the scan results, formulate corrective measures that bring the cloud resources to the desired safe state. Use this tool to formulate Terraform code for the recommended fix, or create a pull request.
- Metrics and Diff Visualization: Visualize metrics and code diffs to show the impact of proposed fixes.
- GitHub Pull Request Generation: Generate automated pull requests to apply infrastructure fixes directly to the user's GitHub repository.

## Style Guidelines:

- Primary color: Midnight blue (#2C3E50) for a professional and secure feel.
- Background color: Light gray (#F0F4F8), providing a clean backdrop that contrasts gently with the primary color.
- Accent color: Teal (#3498DB) to highlight interactive elements and key information.
- Body and headline font: 'Inter', a grotesque-style sans-serif, suitable for headlines or body text
- Use clear and informative icons to represent different resource types and security issues.
- Implement smooth, sequential animations to reveal resources, mappings, and security issues.