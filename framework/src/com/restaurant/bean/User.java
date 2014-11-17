package com.restaurant.bean;
/**  
 * 创建时间：2013-8-16 上午9:25:25  
 * 项目名称：grade  
 * @author zhuzhuo  
 * 文件名称：User.java  
 * 说明：  
 */
public class User {
	private String uId;
	private String userId;
	private String roleId;
	private String orgId;
	private String ip;
	private String loginName;
	private String passWord;
	private String sName;
	private String phone;
	private String address;
	private String eName;
	
	
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getPassWord() {
		return passWord;
	}
	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	private String userName;


	public String getUId() {
		return uId;
	}
	public void setUId(String uId) {
		this.uId = uId;
	}
	public String getSName() {
		return sName;
	}
	public void setSName(String sName) {
		this.sName = sName;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getEName() {
		return eName;
	}
	public void setEName(String eName) {
		this.eName = eName;
	}
}
