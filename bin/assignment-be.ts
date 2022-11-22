#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AssignmentBeStack } from '../lib/assignment-be-stack';

const app = new cdk.App();
new AssignmentBeStack(app, 'AssignmentBeStack', {

});