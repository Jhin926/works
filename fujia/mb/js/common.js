$(document).ready(function(){
  $("input.login-password").focus(function(){
	if($(this).val() != "" && $(this).attr("type") != "password"){
	  $(this).val("").attr("type","password");
	}
  })
  $("input").focus(function(){
	$(this).css("color","#000");
  })
})