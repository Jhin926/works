require(["common"],function(){require(["maintab","blockUI"],function(e){e.init();var l=$.GetQueryString("id");$("#bianji").on("click",function(i){$.EventFn(i);var t=parent.me.tabIdx();$("#mainTab",parent.document).find(".currentClass").index();e.showTab(Base.url+"/html/pop-statistics-new.html?type=0&id="+l+"&pIdx="+t,"编辑")});var i={statistics:function(){var e={id:l};$.ajax({url:Base.sitUrl+"/api/addressList/v1/email/address/detail",data:{data:JSON.stringify(e)},type:"POST",success:function(e,l){if(!e.success)return void $.unLogin(e);var i=e.data,t=i.email,s=[],a=[],n="",c="",h="",d="",r="";if(l=null!=i.phone&&""!=i.phone?i.phone:"",$("#customerName").text(i.name),console.log(l),t.indexOf(";")!=-1){if(s=t.split(";"),s.length>1)for(var m=0;m<s.length;m++)n+='<li>                                                <div style="height:50px;">                                                    <label class="col-sm-1" style="line-height:50px;">邮箱'+(m+1)+'：</label>                                                    <div class="col-sm-11" style="line-height:50px;">'+s[m]+"</div>                                                </div>                                            </li>"}else n='<li>                                        <div style="height:50px;">                                            <label class="col-sm-1" style="line-height:50px;">邮箱：</label>                                            <div class="col-sm-11" style="line-height:50px;">'+t+"</div>                                        </div>                                    </li>";if(l.indexOf(";")!=-1&&null!=l&&""!=l){if(a=l.split(";"),a.length>1)for(var m=0;m<a.length;m++)c+='<li>                                                <div style="height:50px;">                                                    <label class="col-sm-1" style="line-height:50px;">电话'+(m+1)+'：</label>                                                    <div class="col-sm-11" style="line-height:50px;">'+a[m]+"</div>                                                </div>                                            </li>"}else l.indexOf(";")==-1&&null!=l&&""!=l&&(c='<li>                                        <div style="height:50px;">                                            <label class="col-sm-1" style="line-height:50px;">电话：</label>                                            <div class="col-sm-11" style="line-height:50px;">'+l+"</div>                                        </div>                                    </li>");$("#customerEmail").empty(),$("#customerEmail").append(n),$("#customerPhone").empty(),$("#customerPhone").append(c),null!=i.birthday&&""!=i.birthday&&(h='<li>                                        <div style="height:50px;">                                            <label class="col-sm-1" style="line-height:50px;">生日：</label>                                            <div class="col-sm-11" style="line-height:50px;">'+i.birthday+"</div>                                        </div>                                    </li>"),$("#customerBirthday").empty(),$("#customerBirthday").append(h),null!=i.company&&""!=i.company&&(r='<li>                                        <div style="height:50px;">                                            <label class="col-sm-1" style="line-height:50px;">公司：</label>                                            <div class="col-sm-11" style="line-height:50px;">'+i.company+"</div>                                        </div>                                    </li>"),$("#customerBirthday").empty(),$("#customerBirthday").append(r),null!=i.remark&&""!=i.remark&&($("#customerRemark").text(i.remark),d='<li>                                        <div style="height:50px;">                                            <label class="col-sm-1" style="line-height:50px;">备注：</label>                                            <div class="col-sm-11" style="line-height:50px;">'+i.remark+"</div>                                        </div>                                    </li>"),$("#customerRemark").empty(),$("#customerRemark").append(d)}})}};i.statistics()})});