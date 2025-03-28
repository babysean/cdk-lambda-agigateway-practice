# 사용자 정보 등록, 조회 API
![NPM](https://img.shields.io/badge/npm-red?style=flat&logo=npm&logoColor=white)
![Typescript](https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=TypeScript&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/Aws_Lambda-orange?style=flat&logo=awslambda&logoColor=white)
![AWS APIGateway](https://img.shields.io/badge/Aws_APIGateway-blue?style=flat&logo=amazonapigateway&logoColor=white)
![AWS DynamoDB](https://img.shields.io/badge/Aws_DynamoDB-purple?style=flat&logo=amazondynamodb&logoColor=white)

## 프로젝트 개요

사용자 정보 등록, 조회를 위한 API를 구축합니다.
- 이름
- 이메일
- 전화번호
- 개인정보 수집 동의 여부

## 선행 작업
1. [nodeJS 설치](https://nodejs.org/en/download/)하기
2. [Github Repository](https://github.com/babysean/cdk-lambda-agigateway-practice.git) clone
3. CDK 설치하기   
   `npm install -g aws-cdk`
4. [Docker 설치](https://docs.docker.com/get-docker/)하기
5. AWS CLI 설치 및 연동하기

#### 설치한 npm modules
1. `npm install -D @types/aws-lambda`
2. `npm install -D aws-sdk`

## 실행 방법
1. aws 계정 설정   
`export AWS_PROFILE='계정별칭'`
2. AWS CloudFormation 템플릿 생성   
`cdk synth`
3. bootstrap 스택 설치   
`cdk bootstrap`
4. CDK app 배포   
`cdk deploy`

## 생성 확인
1. CloudFormation
2. DynamoDB
3. Lambda
4. API Gateway

## API Docs
| **Function**             |       **URI**       | **Method** | **Params**                                                                              | **Success**                                                                             | **Error**                | 
|:-------------------------|:-------------------:|:----------:|:----------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------|:-------------------------|
| Sign-up user information | /users/registration |    POST    | `{name:string, email:string, phoneNumber:string, isConsentPersonalInformation:boolean}` | "User information insert complete"                                                      | Return to error message  |
| Get user information     |   /users/{email}    |    GET     |                                                                                         | `{name:string, email:string, phoneNumber:string, isConsentPersonalInformation:boolean}` | Return to error message  |

## 테스트 방법
```shell
curl -i -X GET 'https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage}'

curl -i -X POST -d '{parameters}' 'https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage}'
```
### 등록 API
#### Request
`/users/{email}`
```shell
curl -i -X POST \
   -d \
'{
  "email": "test@email.com",
  "name": "sanghoon",
  "phoneNumber": "010-1111-1111",
  "isConsentPersonalInformation": true
}
' \
 'https://2JMD6Y0J3H.execute-api.ap-northeast-2.amazonaws.com/v1/users/registration'
```
#### Response
```shell
HTTP/2 200
content-type: application/json
content-length: 15
date: Fri, 25 Nov 2022 08:58:30 GMT
x-amzn-requestid: 9c7e3bd6-2993-4e12-a610-e777a3cde6d3
access-control-allow-origin: *
x-amz-apigw-id: cJmEUEwBIE0Fciw=
x-amzn-trace-id: Root=1-638083b5-18a53ee715cd6189554b4966;Sampled=0
x-cache: Miss from cloudfront
via: 1.1 d7fcc9c7b428de5effc8b4bdbb9154ce.cloudfront.net (CloudFront)
x-amz-cf-pop: ICN54-C3
x-amz-cf-id: hKEuDStATU5d4Nax_U6QpowEBiWcloL7Zf8jZoWw940GAyXD5DRqnA==

Insert complete
```
### 조회 API

#### Request
`/users/registration`

``` shell
curl -i -X GET 'https://2jmd6y0j3h.execute-api.ap-northeast-2.amazonaws.com/v1/users/parksh1@focusmediakorea.com'
```
#### Response
``` shell
HTTP/2 200 
content-type: application/json
content-length: 123
date: Fri, 25 Nov 2022 06:50:51 GMT
x-amzn-requestid: a28a19f8-7f9a-4d92-9cf2-3f096f180856
access-control-allow-origin: *
x-amz-apigw-id: cJTXxFgloE0FU7w=
x-amzn-trace-id: Root=1-638065cb-4e00b812114805c514efb786;Sampled=0
x-cache: Miss from cloudfront
via: 1.1 98cc70c99d4e07b8cd37265dc48c5a54.cloudfront.net (CloudFront)
x-amz-cf-pop: ICN57-P2
x-amz-cf-id: 779MZIOxtkLVJuSQsFeXRvsKt_i7UchEAkuL2dcEQz5BB5AsaLbPkw==

{"phoneNumber":"010-1111-1111","isConsentPersonalInformation":true,"email":"test@email.com","name":"sanghoon"}
```

