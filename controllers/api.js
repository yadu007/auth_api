var api_lib = require('../lib/api')

let login = async function(req,res){


    try {
        let result = await api_lib.login(req.body);

        if (result.found) {
            res.status(200).json({
                msg: "Login success id = "+result.id
            });
        } else {
            res.status(401).json({
                msg: "Login failed"
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: "InernalServerError"
        });
    }
}
let register = async function(req,res){
    try {
        await api_lib.register(req.body);
        res.status(200).json({
            msg: "User created."
        });
    } catch (exception) {

        console.error(exception);
        return res.status(500).json({
            msg: "InernalServerError"
        });
    }
}
let reset = async function(req,res){
    var key = req.get('x-api-key')
    if(key){
    api_lib.login_check(req.body.email,key,function(resp){
        if(resp){
            if(!req.body.new_pass){
                res.status(200).json({
                    msg: "new password required"
                });
                res.end();
            }
            else{
                api_lib.reset(req.body.email,req.body.new_pass,function(){
                    res.status(200).json({
                        msg: "password updated"
                    });
                    res.end();
                });



            }
;
        }
        else{
            res.status(200).json({
                msg: "Please login to reset the password"
            });
        }

       })


    }

}
let forgot = function(req,res){
    if (req.method == "POST") {

        api_lib.create_token_forgot(req.body.email,req.body.new_pass,function(forgot_ink){
            if(forgot_ink){
                res.status(200).json({
                    forgot_link: forgot_ink
                });
            }
        })
    }
    else if(req.method == "GET"){
        api_lib.verify_forgot(req.query.token,function(val){
            if(val){
                res.status(200).json({
                    response: "done reseting"
                });
            }
            else{
                res.status(200).json({
                    response: "error in reset"
                });

            }
        })

    }
}
let login_check = async function(req,res,next){
    var key = req.get('x-api-key')
    if(key){
    api_lib.login_check(req.body.email,key,function(resp){
        if(resp){

        res.status(200).json({
         msg: "already logged in."
     });
     res.end();
        }
        else{
            next()
        }

       })


    }
    else{
        next()
    }

}
module.exports = {
    login,register,reset,forgot,login_check
}
