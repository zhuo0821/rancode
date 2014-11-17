package com.restaurant.service;

import java.io.UnsupportedEncodingException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.Cookie;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import com.restaurant.alipay.AlipayConfig;
import com.restaurant.alipay.AlipaySubmit;
import com.restaurant.bean.Address;
import com.restaurant.bean.Member;
import com.restaurant.bean.Product;
import com.restaurant.dwr.DWR;

public class SaleProductService {
	
	private JdbcTemplate jdbcTemplate;
	private final Log logger = LogFactory.getLog(SaleProductService.class);
	
	public String[] beforeAddToChart(String pid,Member member,String ip){
		String tip = "";
		String bool = "";
		//验证是否在黑名单中
		String phone = member.getPhone();
		String email = member.getEmail();
		String query = "select count(*) as count from black_list where phone='"+ phone +"' or email='"+ email +"' or ip='"+ip+"'";
		int count = jdbcTemplate.queryForInt(query);
		if(count==0){
			//验证是否有菜了
			query = "select amount,made_volume from  product where id="+pid;
			Map<String, Object> res = jdbcTemplate.queryForMap(query);
			int amount = Integer.parseInt(res.get("amount").toString());
			int madeVolume = Integer.parseInt(res.get("made_volume").toString());
			if(madeVolume >= amount){
				tip = "菜量不够，请选择其他菜品";
				bool = "0";
			}else {
				//提示时间
				query = "select order_detail.o_id,order_detail.number,product.made_time from order_form inner join order_detail on order_form.id=order_detail.o_id inner join product on product.id=order_detail.p_id where order_form.status=2";
				List<Map<String,Object>> timeRes = jdbcTemplate.queryForList(query);
				int orderCount = 0;
				float allTime = 0.0f;
				Set<String> set = new HashSet<String>();
				for(Map<String,Object> map : timeRes){
					String oid = map.get("o_id").toString();
					int number = Integer.parseInt(map.get("number").toString());
					float made_time = Float.parseFloat(map.get("made_time").toString());
					set.add(oid);
					allTime += number*made_time;
				}
				orderCount = set.size();
				tip = "您前面的订单有" + orderCount + "个! 预计排队时间" + allTime + "分钟";
				bool = "1";
			}
		}else{
			tip = "您在黑名单中，无法为您提供服务";
			bool = "0";
		}
		return new String[]{tip,bool};
	}

	public int getLastedProductCount(String id){
		String query = "select amount,made_volume from  product where id="+id;
		Map<String, Object> res = jdbcTemplate.queryForMap(query);
		int amount = Integer.parseInt(res.get("amount").toString());
		int madeVolume = Integer.parseInt(res.get("made_volume").toString());
		return amount-madeVolume;
	}
	
	public String getProductsJson(Cookie[] cookies) throws UnsupportedEncodingException{
		String products = "";
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (cookie.getName().equalsIgnoreCase("products")) {
					products = cookie.getValue();
					products = java.net.URLDecoder.decode(products, "utf-8");
				}
			}
		}
		return products;
	}
	
	public Product getProduct(String id){
		String query = "select * from product where del_flag=1 and id="+id;
		Product p = jdbcTemplate.queryForObject(query, new RowMapper<Product>(){
			@Override
			public Product mapRow(ResultSet arg0, int arg1) throws SQLException {
				Product p = null;
				if(arg0 != null){
					p = new Product();
					p.setId(arg0.getInt("id"));
					p.setC_id(arg0.getInt("c_id"));
					p.setS_id(arg0.getInt("s_id"));
					p.setAdd_time(arg0.getString("add_time"));
					p.setAmount(arg0.getInt("amount"));
					p.setDiscount(arg0.getFloat("discount"));
					p.setDiscount_flag(arg0.getInt("discount_flag"));
					p.setMade_time(arg0.getInt("made_time"));
					p.setName(arg0.getString("name"));
					p.setOrder_index(arg0.getInt("order_index"));
					p.setPic(arg0.getString("pic"));
					p.setP_id(arg0.getInt("p_id"));
					p.setPrice(arg0.getFloat("price"));
					p.setSales_volume(arg0.getInt("sales_volume"));
					p.setMade_volume(arg0.getInt("made_volume"));
				}
				return p;
			}
		});
		return p;
	}
	
	public List<Product> getProducts(Cookie[] cookies) throws UnsupportedEncodingException{
		List<Product> products = new LinkedList<Product>();
		String productsJson = getProductsJson(cookies);
		JSONArray json = JSONArray.fromObject(productsJson);
		for(int i = 0 ; i < json.size() ; i++){
			JSONObject j = (JSONObject)json.get(i);
			String id = j.getString("id");
			Product p = getProduct(id);
			int buyNumber = Integer.parseInt(j.getString("number").toString());
			p.setBuyNumber(buyNumber);
			products.add(p);
		}
		return products;
	}
	
	public float getAllCharge(List<Product> products){
		float allCharge = 0.0f;
		for(Product p : products){
			allCharge += p.getBuyNumber() * p.getPrice() * p.getDiscount();
		}
		return allCharge;
	}
	
	public List<Address> getAddress(Member member){
		List<Address> list = null;
		String query = "select * from address where m_id="+member.getId()+ " and del_flag=1";
		list = jdbcTemplate.query(query, new RowMapper<Address>(){

			@Override
			public Address mapRow(ResultSet arg0, int arg1) throws SQLException {
				// TODO Auto-generated method stub
				Address address = null;
				if(arg0 != null){
					address = new Address();
					address.setId(arg0.getInt("id"));
					address.setM_id(arg0.getInt("m_id"));
					address.setAddress(arg0.getString("address"));
					address.setConcacts(arg0.getString("concacts"));
					address.setPhone(arg0.getString("phone"));
					address.setDefault_flag(arg0.getInt("default_flag"));
				}
				return address;
			}
			
		});
		return list;
	}
	
	public void updateAddress(String id,String address,String concacts,String phone){
		String query = "update address set address='"+address+"' ,concacts='"+concacts+"', phone='"+phone+"' where id="+id;
		jdbcTemplate.update(query);
	}
	
	public String insertOrder(String a_id,Member member,String payType,Cookie[] cookies) throws UnsupportedEncodingException{
		String sid = getStoreId(cookies);
		List<Product> products = getProducts(cookies);
		String query1 = "",query2="";
		float allCharge = 0.0f;
		for(Product p : products){
			float amount = p.getBuyNumber() * p.getPrice() * p.getDiscount();
			query1 += "insert into order_detail (p_id,number,amount,o_id) values ("+p.getId()+","+p.getBuyNumber()+","+amount+",{oid});";
			//jdbcTemplate.update(query, new Object[]{p.getId(),p.getBuyNumber(),p.getPrice()*p.getBuyNumber(),oid}, new int[]{Types.INTEGER,Types.INTEGER,Types.FLOAT,Types.INTEGER});
			allCharge += amount;
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String timestamp = df.format(new Date());
		String tempNumber = "s" + sid + timestamp.split(" ")[0].replace("-", "");
		int ncount = jdbcTemplate.queryForInt("select count(*) from order_form where number like '"+tempNumber+"%'");
		tempNumber += String.format("%03d", ncount);
		
		query2 = "insert into order_form (s_id,a_id,m_id,allcharge,number,pay_type) values (?,?,?,?,?,?)";
		jdbcTemplate.update(query2,new Object[]{sid,a_id,member.getId(),allCharge,tempNumber,payType},new int[]{Types.INTEGER,Types.INTEGER,Types.INTEGER,Types.FLOAT,Types.VARCHAR,Types.INTEGER});
		int oid = jdbcTemplate.queryForInt("select id from order_form where number='"+tempNumber+"'");
		query1 = query1.replace("{oid}", oid+"");
		String[] querys = query1.split(";");
		for(String q : querys){
			jdbcTemplate.update(q);
		}
		
		String sql = "select id from user where s_id=?";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql,sid);
		if(list.size()>0){
			for (Map<String, Object> map : list) {
				String userId = (int) map.get("id")+"";
				DWR.send(userId, "", "play");
			}
		}
		return tempNumber;
	}
	
	public String makeAliPayForm(String orderNumber,String allCharge){
		String payment_type = "1";
		//页面跳转同步通知页面路径
		String return_url = "http://127.0.0.1:8080/restaurant/payStatus.jspx";
		String out_trade_no = orderNumber;
		String subject = orderNumber;
		String total_fee = allCharge;
		Map<String, String> sParaTemp = new HashMap<String, String>();
		sParaTemp.put("service", "create_direct_pay_by_user");
        sParaTemp.put("partner", AlipayConfig.partner);
        sParaTemp.put("_input_charset", AlipayConfig.input_charset);
		sParaTemp.put("payment_type", payment_type);
		sParaTemp.put("return_url", return_url);
		sParaTemp.put("out_trade_no", out_trade_no);
		sParaTemp.put("subject", subject);
		sParaTemp.put("total_fee", total_fee);
		
		//建立请求
		String sHtmlText = AlipaySubmit.buildRequest(sParaTemp,"get","确认");
		return sHtmlText;
	}
	
	public void changeOrderPayStatus(String number,String payStatus,String aliNumber){
		String query = "update order_form set pay_status="+payStatus+", alipay_number='"+aliNumber+"' where number='"+number+"'";
		jdbcTemplate.update(query);
	}
	
	public String getStoreId(Cookie[] cookies){
		String storeId = "";
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				Cookie cookie = cookies[i];
				if (cookie.getName().equalsIgnoreCase("storeId")) {
					storeId = cookie.getValue();
				}
			}
		}
		return storeId;
	}
	
	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
}
