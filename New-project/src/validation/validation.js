let validation = {};

validation.checkPhone = (phone) => {
    let pattern = /^1[34578]\d{9}$/;
    if (!phone) {
        return '请输入手机号码！';
    } else if (!pattern.test(phone)) {
        return '手机号码有误！';
    } else {
        return false;
    }

}

validation.checkPhoneTrue = (phone) => {
    let pattern = /^1[34578]\d{9}$/;
    if(!pattern.test(phone) || phone == '') {
        return '手机号码有误'
    } else {
        return false;
    }
}
validation.checkNameTrue = (name) => {
    let pattern = /^[A-Za-z\u4e00-\u9fa5]+$/;
    if(!pattern.test(name) || name == '') {
        return '姓名请输入汉字或字母！'
    } else {
        return false;
    }
}
validation.checkCode = (code, confirmCode) => {
	console.log(code)
	console.log(confirmCode)
    if (!code) {
        return '请输入验证码！';
    } else if (code != confirmCode) {
        return '验证码有误！';
    } else {
        return false;
    }
}

validation.checkNull = (param, show) => {
    if (!param) {
        return show;
    } else {
        return false;
    }
}
validation.checkCommon = (newName,oldName) =>{
    if(newName !== oldName){
        return '新密码不一致'
    }else{
        return false;
    }
}

validation.checkDifferent = (newName,oldName) =>{
    if(newName == oldName){
        return '与原密码不能相同'
    }else{
        return false;
    }
}
module.exports = validation;
