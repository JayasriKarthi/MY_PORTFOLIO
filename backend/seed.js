import "dotenv/config";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Skill from "./models/Skill.js";
import Project from "./models/Project.js";
import Certificate from "./models/Certificate.js";
import Journey from "./models/Journey.js";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  // 1. Create the admin user (only if one doesn't already exist)
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: "Jayashree Selvi",
    });
    console.log(`Admin user created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  // 2. Seed skills (only if the collection is empty)
  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany([
      { category: "Cloud", name: "AWS", proficiency: 85, order: 1 },
      { category: "Cloud", name: "EC2", proficiency: 80, order: 2 },
      { category: "Cloud", name: "S3", proficiency: 80, order: 3 },
      { category: "Cloud", name: "VPC", proficiency: 75, order: 4 },
      { category: "Cloud", name: "RDS", proficiency: 65, order: 5 },
      { category: "Cloud", name: "Lambda", proficiency: 60, order: 6 },
      { category: "DevOps", name: "Docker", proficiency: 80, order: 1 },
      { category: "DevOps", name: "Kubernetes", proficiency: 65, order: 2 },
      { category: "DevOps", name: "GitHub Actions", proficiency: 60, order: 3 },
      { category: "DevOps", name: "Jenkins", proficiency: 50, order: 4 },
      { category: "Infrastructure as Code", name: "Terraform", proficiency: 45, order: 1 },
      { category: "Infrastructure as Code", name: "CloudFormation", proficiency: 40, order: 2 },
      { category: "Infrastructure as Code", name: "Ansible", proficiency: 35, order: 3 },
      { category: "Languages", name: "Python", proficiency: 75, order: 1 },
      { category: "Languages", name: "Java", proficiency: 65, order: 2 },
      { category: "Languages", name: "SQL", proficiency: 70, order: 3 },
      { category: "Databases", name: "MySQL", proficiency: 70, order: 1 },
      { category: "Databases", name: "PostgreSQL", proficiency: 60, order: 2 },
      { category: "Databases", name: "DynamoDB", proficiency: 55, order: 3 },
    ]);
    console.log("Seeded skills.");
  }

  // 3. Seed projects
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        name: "AWS EKS Flask Deployment",
        slug: "aws-eks-flask-deployment",
        summary: "A containerized Flask backend deployed to Kubernetes on Amazon EKS.",
        status: "completed",
        difficulty: 5,
        category: "cloud",
        awsServices: ["EKS", "Docker", "Aurora", "CloudWatch", "ALB"],
        flow: ["User", "ALB", "EKS", "Flask pods", "Aurora"],
        githubUrl: "",
        demoUrl: "",
        featured: true,
        order: 1,
      },
      {
        name: "AI Plant Disease Detection",
        slug: "ai-plant-disease-detection",
        summary: "An Android app that detects plant disease using a SageMaker-hosted CNN model.",
        status: "in_progress",
        difficulty: 5,
        category: "ai",
        awsServices: ["SageMaker", "Lambda", "API Gateway", "DynamoDB"],
        flow: ["Android app", "API Gateway", "Lambda", "SageMaker", "DynamoDB"],
        featured: true,
        order: 2,
      },
      {
        name: "AWS Lex Chatbot",
        slug: "aws-lex-chatbot",
        summary: "A conversational chatbot built with Lex, Lambda, and DynamoDB.",
        status: "completed",
        difficulty: 4,
        category: "ai",
        awsServices: ["Lex", "Lambda", "DynamoDB"],
        flow: ["User", "Lex", "Lambda", "DynamoDB"],
        order: 3,
      },
      {
        name: "Static Website on S3 + CloudFront",
        slug: "static-website-s3-cloudfront",
        summary: "A globally cached static site delivered through CloudFront with Route 53 DNS.",
        status: "completed",
        difficulty: 3,
        category: "cloud",
        awsServices: ["S3", "CloudFront", "Route 53"],
        flow: ["User", "CloudFront", "S3", "Route 53"],
        order: 4,
      },
      {
        name: "Aurora Database with EC2",
        slug: "aurora-database-ec2",
        summary: "A managed Aurora database tier wired to an EC2 application layer.",
        status: "completed",
        difficulty: 4,
        category: "cloud",
        awsServices: ["Aurora", "EC2", "IAM"],
        flow: ["App (EC2)", "Aurora primary", "Aurora replica"],
        order: 5,
      },
      {
        name: "VPC Networking Lab",
        slug: "vpc-networking-lab",
        summary: "A secure 3-tier VPC with public and private subnet isolation.",
        status: "completed",
        difficulty: 5,
        category: "networking",
        awsServices: ["VPC", "EC2", "NAT Gateway", "Security Groups"],
        flow: ["Public subnet", "ALB", "Private subnet", "EC2", "DB"],
        order: 6,
      },
    ]);
    console.log("Seeded projects.");
  }

  // 4. Seed certificates
  if ((await Certificate.countDocuments()) === 0) {
    await Certificate.insertMany([
      { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", status: "completed", progress: 100, order: 1 },
      { name: "AWS AI Practitioner", issuer: "Amazon Web Services", status: "completed", progress: 100, order: 2 },
      { name: "AWS Solutions Architect — Associate", issuer: "Amazon Web Services", status: "in_progress", progress: 40, expectedDate: "August 2026", order: 3 },
      { name: "Certified Kubernetes Administrator (CKA)", issuer: "Cloud Native Computing Foundation", status: "not_started", progress: 0, order: 4 },
    ]);
    console.log("Seeded certificates.");
  }

  // 5. Seed journey/progress stats
  if ((await Journey.countDocuments()) === 0) {
    await Journey.create({
      leetcodeProblems: 450,
      githubCommits: 1460,
      hackathons: 2,
      awsServicesLearned: 18,
      awsServicesTotal: 25,
      progressByArea: { cloud: 82, devops: 65, ai: 54, programming: 72, networking: 70 },
      currentGoal: "AWS Solutions Architect Associate",
      currentGoalProgress: 80,
    });
    console.log("Seeded journey stats.");
  }

  console.log("Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
