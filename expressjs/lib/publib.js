function Verify_User(req){ 
    if(req.user && req.user.id){
    return req.user.id=='2002024' || req.user.id=='1999002' || req.user.id=='2006001' ;} 
    return false;
 }
function Verify_User_STAFINFO(req){ 
    if(req.user && req.user.id){
        return '2002024,1999002,2006001,2016023'.indexOf(req.user.id)>-1 ;} 
    return false;
 }
function Verify_User_STUDINFO(req){ 
    if(req.user && req.user.id){
        return req.user.id=='2002024' || req.user.id=='1999002' || req.user.id=='2006001'  || req.user.id=='2017008'  || req.user.id=='2017035' ;} 
    return false;
 }
function Verify_DECODE_STAFPWD(x){ 
    return x.substr(5,5)+"bc";
 }
function GetCurrentYear(req){
    if(req.user&&req.user.marksys_info&&Array.isArray(req.user.marksys_info)){
      return req.user.marksys_info[0][0].session.replace("~","/");
    }else{
      var d = new Date();
      var n = d.getFullYear();
      var m = d.getMonth();
      return  m<8  ? (n-1)+'/'+n : n+'/'+(n+1);
    }
}
function splitClassno(term,obj) {
    obj.field="";
    let grade = null;
    let classno = null;
    let cno = null;
    if (term.startsWith("P")) { grade = term.substr(0, 2); classno = term.length > 2 ? term.substr(2, 1) : null; cno = term.length > 3 ? term.substr(3, 2) : null; }
    if (term.startsWith("SC") || term.startsWith("SG")) {
      grade = term.substr(0, 3); classno = term.length > 3 ? term.substr(3, 1) : null; cno = term.length > 3 ? term.substr(4, 2) : null;
    }
    obj.term=grade;
    if(classno) obj.field+=` CLASS='${classno}' and `;
    if(cno) obj.field+=` C_NO='${cno}' and `;
    obj.field+=" GRADE "
    console.log(obj)
  }
module.exports = {
    Verify_User: Verify_User,
    Verify_User_STAFINFO:Verify_User_STAFINFO,
    Verify_User_STUDINFO:Verify_User_STUDINFO,
    Verify_DECODE_STAFPWD:Verify_DECODE_STAFPWD,
    GetCurrentYear:GetCurrentYear,
    splitClassno:splitClassno
};