package com.restaurant.util;
/**  
 * 创建时间：2014-6-21 下午3:30:32  
 * 项目名称：restaurant  
 * @author 朱卓
 * 文件名称：Common.java  
 * 说明：  
 */
public class Common {
	
	public static boolean isNull(Object o){
		boolean result = false;
		if (o == null) {
			return true;
		}
		if(o.getClass() == String.class){
			if(o==null || o.equals(""))
				result = true; 
		}
		return result;
	}
}
