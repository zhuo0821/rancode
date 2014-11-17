package com.restaurant.util;

import java.util.Properties;  
import javax.mail.Message;  
import javax.mail.MessagingException;  
import javax.mail.Session;  
import javax.mail.Transport;  
import javax.mail.internet.AddressException;  
import javax.mail.internet.InternetAddress;  
import javax.mail.internet.MimeMessage; 

public class EmailUtil {
	
	 // 设置服务器  
    private static String KEY_SMTP = "mail.smtp.host";  
    private static String VALUE_SMTP = "smtp.qq.com";  
    // 服务器验证  
    private static String KEY_PROPS = "mail.smtp.auth";  
    private static boolean VALUE_PROPS = true;  
    // 发件人用户名、密码  
    private String SEND_USER = "username@qq.com";  
    private String SEND_UNAME = "admin";  
    private String SEND_PWD = "password";  
    // 建立会话   
    private MimeMessage message;  
    private Session s;  
    
    private volatile static EmailUtil emailUtil = null;
    
    /* 
     * 初始化方法 
     */  
    private EmailUtil() {  
        Properties props = System.getProperties();  
        props.setProperty(KEY_SMTP, VALUE_SMTP);  
        props.put(KEY_PROPS, VALUE_PROPS);  
        s = Session.getInstance(props);  
         s.setDebug(true);//开启后有调试信息   
        message = new MimeMessage(s);  
    }  
    
    public static EmailUtil getInstance () {
    	if(emailUtil == null) {
    		synchronized (EmailUtil.class) {
    			if(emailUtil == null) {
    				emailUtil = new EmailUtil();
    			}
    		}
    	}
    	return emailUtil;
    }
    
    /** 
     * 发送邮件 
     *  
     * @param headName 
     *            邮件头文件名 
     * @param sendHtml 
     *            邮件内容 
     * @param receiveUser 
     *            收件人地址 
     * @throws Exception 
     */  
    public void sendHtmlEmail(String headName, String sendHtml,  
            String receiveUser) throws Exception {  
            // 发件人  
            InternetAddress from = new InternetAddress(SEND_USER);  
            message.setFrom(from);  
            // 收件人  
            InternetAddress to = new InternetAddress(receiveUser);  
            message.setRecipient(Message.RecipientType.TO, to);  
            // 邮件标题  
            message.setSubject(headName);  
            String content = sendHtml.toString();  
            // 邮件内容,也可以使纯文本"text/plain"  
            message.setContent(content, "text/html;charset=GBK");  
            message.saveChanges();  
            Transport transport = s.getTransport("smtp");  
            // smtp验证，就是你用来发邮件的邮箱用户名密码  
            transport.connect(VALUE_SMTP, SEND_UNAME, SEND_PWD);  
            // 发送  
            transport.sendMessage(message, message.getAllRecipients());  
            transport.close();  
            System.out.println("send success!");  
    }  
}
