var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    function solution(arr) {

        var answer = 0;
        let sum = 0;

        for(let i in arr){
            sum += parseInt(i);
            console.log(sum)
        }

        answer = sum / arr.length;

        return answer;
    }

    console.log(solution([1,2,3,4]))



    res.send('hi')
});


module.exports = router;
