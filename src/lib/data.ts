import type { LucideIcon } from "lucide-react";
import { Server, Database, Archive, ShieldAlert, ShieldX } from "lucide-react";

export interface AwsResource {
  id: string;
  name: string;
  type: "EC2" | "S3" | "RDS";
  Icon: LucideIcon;
}

export const awsResources: AwsResource[] = [
  { id: "ec2-1", name: "prod-web-server-01", type: "EC2", Icon: Server },
  { id: "s3-1", name: "app-data-logs", type: "S3", Icon: Archive },
  { id: "rds-1", name: "user-database", type: "RDS", Icon: Database },
];

export interface MappedResource extends AwsResource {
  match: number;
  mapped: boolean;
  terraformFile: string;
}

export const mappedResources: MappedResource[] = [
  { ...awsResources[1], match: 99.5, mapped: true, terraformFile: "s3.tf" },
  { ...awsResources[0], match: 100, mapped: true, terraformFile: "main.tf" },
  { ...awsResources[2], match: 98, mapped: true, terraformFile: "db.tf" },
];

export interface SecurityIssue {
  id: string;
  title: string;
  severity: "High" | "Medium" | "Low";
  Icon: LucideIcon;
  scanId: string;
  policy: string;
  resourceName: string;
  resourceType: string;
  description: string;
  currentTerraformCode: string;
}

export const securityIssues: SecurityIssue[] = [
  {
    id: "issue-1",
    title: "Open S3 Bucket",
    severity: "High",
    Icon: ShieldAlert,
    scanId: "scan-xyz-123",
    policy: "POL-001",
    resourceName: "app-data-logs",
    resourceType: "S3",
    description: "The S3 bucket 'app-data-logs' has public read access, posing a data exposure risk.",
    currentTerraformCode: `resource "aws_s3_bucket" "app_data_logs" {
  bucket = "app-data-logs"
  acl    = "public-read"
}`,
  },
  {
    id: "issue-2",
    title: "Outdated EC2 Patch",
    severity: "Medium",
    Icon: ShieldX,
    scanId: "scan-xyz-124",
    policy: "POL-025",
    resourceName: "prod-web-server-01",
    resourceType: "EC2",
    description: "The EC2 instance 'prod-web-server-01' is running an AMI with known vulnerabilities.",
    currentTerraformCode: `resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0" // Outdated AMI
  instance_type = "t2.micro"
}`
  },
  {
    id: "issue-3",
    title: "Unencrypted RDS",
    severity: "High",
    Icon: ShieldAlert,
    scanId: "scan-xyz-125",
    policy: "POL-008",
    resourceName: "user-database",
    resourceType: "RDS",
description: "The RDS instance 'user-database' does not have encryption at rest enabled.",
    currentTerraformCode: `resource "aws_db_instance" "default" {
  allocated_storage    = 20
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  name                 = "mydb"
  username             = "foo"
  password             = "foobarbaz"
  parameter_group_name = "default.mysql5.7"
  storage_encrypted    = false
}`
  },
];

export const commits = [
    {
      id: 1,
      message: 'feat: Add initial Terraform config for S3',
      author: 'terraform-pilot-bot',
      status: 'success'
    },
    {
      id: 2,
      message: 'fix(security): Restrict public access to app-data-logs S3 bucket',
      author: 'terraform-pilot-bot',
      status: 'success'
    },
    {
      id: 3,
      message: 'chore: Update documentation for S3 policy',
      author: 'terraform-pilot-bot',
      status: 'pending'
    }
];

export const timelineSteps = ["Discover", "Map", "Fix", "PR"];
