# Node JS Coding Assignment
Create a REST API for the following requirements. 
## Objective: 
● Build a sprint retrospective board to streamline the process of conducting a retrospective meeting. 

##  Requirements: 
* Users should be able to create different points for the retrospective meeting. 
* Users should be able to edit/delete the points created by them. 
* Users should be able to categorize their points for the meeting according to: Went Well, Didn’t go well, Need to improve, Extras.. 
* Users should be able to query based on the category of points. 

## Additional Requirements: 
* Follow best coding practices to accomplish this assignment. 
* Implement searching, sorting, filtering, pagination for the retrospective points. 
* Comment the code wherever necessary. 
* Create a github repository and share the link when the assignment is done. 
* Access Control implementation to ensure user has access to only the points that have been created by himself/herself. 


## Modules & Fields: 
* Create/Edit Point: ID, Title, Description, Category (Went well, Didn’t go well, Need to improve, extras) 
* List Points: Title, Description, Category, Author 


## Setup

1. Ensure `node (>14.4.0)` and `npm` are installed
2. Run `npm install`
3. Run `npm test`
4. Run `npm start`
5. Hit the server to test health `curl localhost:8010/health` and expect a `200` response 

## API DOC

* Open http://localhost:8010/api-docs/#/