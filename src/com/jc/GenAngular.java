package com.jc;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

public class GenAngular {
	
	public static boolean just_models = false;
	public static boolean reseed = false;
	
	public static String app_xml = "angular_app_presentationsells.xml";
	public static String gen_dir = "gen_tmp";
	
	public static String[] includemodels = {
//		"role",
//		"userrole"
	};

	public static void main(String[] args) throws Exception {

		Document doc = getConfigXML();
	    Node app = (Node) getXpath(doc, "/app", XPathConstants.NODE);
	    Node models = (Node) getXpath(doc, "/app/models", XPathConstants.NODE);
	    Node menus = (Node) getXpath(doc, "/app/menus", XPathConstants.NODE);
	    NodeList modelList = (NodeList) getXpath(doc, "/app/models/model", XPathConstants.NODESET);

	    String appName = getAttribute(app, "name");
	    
		System.out.println("Generating " + appName + "...");
		if ( reseed ) {
		    unZipSeed(appName);
		}
	    
	    String genDir = gen_dir + "/" + appName;
	    
    	if ( !just_models ) {
			generateFileFromTemplate(doc, menus, "./templates/publicControllerHeader.js", genDir + "/public/js/controllers/header.js");
			generateFileFromTemplate(doc, menus, "./templates/publicControllerIndex.js", genDir + "/public/js/controllers/index.js");
			generateFileFromTemplate(doc, models, "./templates/README.md", genDir + "/README.md");
			generateFileFromTemplate(doc, models, "./templates/configConfig.js", genDir + "/config/config.js");
			generateFileFromTemplate(doc, models, "./templates/publicInit.js", genDir + "/public/init.js");
			generateFileFromTemplate(doc, models, "./templates/configRoutes.js", genDir + "/config/routes.js");
			generateFileFromTemplate(doc, models, "./templates/viewsIncludesHead.jade", genDir + "/app/views/includes/head.jade");
			generateFileFromTemplate(doc, models, "./templates/viewsIncludesFoot.jade", genDir + "/app/views/includes/foot.jade");
			generateFileFromTemplate(doc, models, "./templates/publicApp.js", genDir + "/public/js/app.js");
			generateFileFromTemplate(doc, models, "./templates/publicConfig.js", genDir + "/public/js/config.js");
			generateFileFromTemplate(doc, models, "./templates/appUserController.js", genDir + "/app/controllers/users.js");
			generateFileFromTemplate(doc, models, "./templates/appUserModel.js", genDir + "/app/models/user.js");
			generateFileFromTemplate(doc, app, "./templates/publicGlobal.js", genDir + "/public/js/services/global.js");
    	}
    	
	    for (int i=0; i<modelList.getLength();i++){
	    	Node model = modelList.item(i);
	    	if ( includemodels == null || includemodels.length == 0 ) {
		    	processModel(doc, model);
	    	} else 
	    	if ( contains(includemodels, getAttribute(model, "name")) ) {
		    	processModel(doc, model);
	    	}
	    }

		System.out.println(appName + " generated");
	}
	
	private static boolean contains(String[] array, String str) {
		boolean found = false;
		
		if ( array == null ) {
			return found;
		}
		
		for ( int i=0; i<array.length; i++ ) {
			if ( array[i].equals(str) ) {
				return true;
			}
		}
		return found;
	}
	
	private static void processModel(Document doc, Node model) throws Exception {
		String modelname = getAttribute(model, "name");

	    Node app = (Node) getXpath(doc, "/app", XPathConstants.NODE);

	    String appName = getAttribute(app, "name");
	    String genDir = gen_dir + "/" + appName;
	    
		File viewsDir = new File(genDir + "/public/views/" + modelname + "s");
		viewsDir.mkdirs();
		
		generateFileFromTemplate(doc, model, "./templates/appModel.js", genDir + "/app/models/" + modelname + ".js");
		generateFileFromTemplate(doc, model, "./templates/appController.js", genDir + "/app/controllers/" + modelname + "s.js");
		generateFileFromTemplate(doc, model, "./templates/publicController.js", genDir + "/public/js/controllers/" + modelname + "s.js");
		generateFileFromTemplate(doc, model, "./templates/publicService.js", genDir + "/public/js/services/" + modelname + "s.js");
		generateFileFromTemplate(doc, model, "./templates/publicViewsView.html", genDir + "/public/views/" + modelname + "s/view.html");
		generateFileFromTemplate(doc, model, "./templates/publicViewsList.html", genDir + "/public/views/" + modelname + "s/list.html");
		generateFileFromTemplate(doc, model, "./templates/publicViewsCreate.html", genDir + "/public/views/" + modelname + "s/create.html");
		generateFileFromTemplate(doc, model, "./templates/publicViewsEdit.html", genDir + "/public/views/" + modelname + "s/edit.html");
	}
	
//	private static String getModelTitle(Node refmodel, String modelName) throws Exception {
//		
//	    Node node = (Node) getXpath(refmodel, "../model[@name='" + modelName + "']", XPathConstants.NODE);
//	    
//	    if ( node == null ) {
//	    	return null;
//	    }
//	    
//	    return getAttribute(node, "title");
//	}
	
	private static void generateFileFromTemplate(Document doc, Node node, String templateFile, String outputFile) throws Exception {
		String nodename = getAttribute(node, "name") + "";
		String nodetitle = getAttribute(node, "title") + "";
		
		File input = new File(templateFile);
		FileInputStream fis = new FileInputStream(input);
		byte[] data = new byte[(int)input.length()];
	    fis.read(data);
	    fis.close();
	    String outputString = new String(data);
		    
		StringBuilder populateBuf = new StringBuilder("");
		StringBuilder controllerParamsBuf = new StringBuilder("");
		StringBuilder functionParamsBuf = new StringBuilder("");
		
	    NodeList fields = (NodeList) getXpath(node, ".//field", XPathConstants.NODESET);
	    for (int i=0; i<fields.getLength();i++){
	    	Node field = fields.item(i);
	    	String type = getAttribute(field, "type");
	    	if ( type.equals("ref") ) {
	    		String refObj = toCamel(getAttribute(field, "ref-obj"));
	    		controllerParamsBuf.append("'" + refObj + "s',");
	    		functionParamsBuf.append(refObj + "s,");
	    		populateBuf.append(getAttribute(field, "name") + " ");
	    	}
	    }

	    List<RepeatBlock> repeatBlocks = getRepeatBlock(outputString);
	    if ( repeatBlocks.size() > 0 ) {
		    outputString = repeatBlocks.get(repeatBlocks.size()-1).source;
	    }
		
		for ( RepeatBlock repeatBlock : repeatBlocks ) {
		    
		    String repl = processRepeatBlock(node, "", null, repeatBlock);
//		    System.out.println("generatePublicControllerFile(" + modelname + "): repeat.index=" + repeatBlock.index + ", strb=[" + strb.toString() + "]");
		    outputString = outputString.replace("REPLACEBLOCK" + repeatBlock.index, repl);
		}
		
		String populateStr = populateBuf.toString().trim();
		String controllerParamsStr = controllerParamsBuf.toString().trim();
		String functionParamsStr = functionParamsBuf.toString().trim();
		
	    Node app = (Node) getXpath(doc, "/app", XPathConstants.NODE);
	    Node database = (Node) getXpath(app, "database", XPathConstants.NODE);

	    String appName = getAttribute(app, "name");
	    String appTitle = getAttribute(app, "title");
	    String appDescription = (String)getXpath(app, "description", XPathConstants.STRING);
	    String appDb = getAttribute(database, "name");
	    String appUrl = getAttribute(database, "url");

	    outputString = outputString.replaceAll("\\$\\{app.name\\}", appName);
		outputString = outputString.replaceAll("\\$\\{app.title\\}", appTitle);
		outputString = outputString.replaceAll("\\$\\{app.description\\}", appDescription);
		outputString = outputString.replaceAll("\\$\\{app.db\\}", appDb);
		outputString = outputString.replaceAll("\\$\\{app.db-url\\}", appUrl);
		outputString = outputString.replaceAll("\\$\\{model.name\\}", nodename);
		outputString = outputString.replaceAll("\\$\\{model.camelname\\}", toCamel(nodename));
		outputString = outputString.replaceAll("\\$\\{model.title\\}", nodetitle);
		outputString = outputString.replaceAll("\\$\\{populate-list\\}", populateStr);
		outputString = outputString.replaceAll("\\$\\{controller-params-list\\}", controllerParamsStr);
		outputString = outputString.replaceAll("\\$\\{function-params-list\\}", functionParamsStr);
		
		File output = new File(outputFile);
		FileWriter fw = new FileWriter(output);
		
		fw.write(outputString);
		fw.close();
	}
	
	private static String toCamel(String str) {
		if ( str == null || str.length() < 1 ) {
			return str;
		}
		
		return str.substring(0, 1).toUpperCase() + str.substring(1);
	}
	
	private static String processRepeatBlock(Node node, String parentName, RepeatBlock parentBlock, RepeatBlock repeatBlock) throws Exception {
	    String outputString = repeatBlock.block;
		String nodename = getAttribute(node, "name") + "";
		String nodeStr = node.getNodeName();

		String xpath = (repeatBlock.xpath.startsWith("./") ? "" : ".//") + repeatBlock.xpath;
		String type = repeatBlock.type;
		
		StringBuilder strb = new StringBuilder("");
		
		String parentType = parentBlock != null ? parentBlock.type : "";
		xpath = xpath.replaceAll("\\$\\{" + parentType + ".name\\}", parentName);
		//System.out.println("type=" + type + ", nodename=" + nodename + ", xpath=" + xpath + ", parentName=" + parentName);

		NodeList fields2 = (NodeList) getXpath(node, xpath, XPathConstants.NODESET);
	    for (int i=0; i<fields2.getLength();i++){
	    	Node field = fields2.item(i);
	    	String fieldname = getAttribute(field, "name") + "";
	    	String fieldtype = getAttribute(field, "type") + "";
	    	String fieldtitle = getAttribute(field, "title") + "";

		    if ( repeatBlock.subBlocks.size() > 0 ) {
			    outputString = repeatBlock.subBlocks.get(repeatBlock.subBlocks.size()-1).source;
		    }

		    for ( RepeatBlock subBlock : repeatBlock.subBlocks ) {
		    	String sub = processRepeatBlock(node, fieldname, repeatBlock, subBlock);
			    outputString = outputString.replace("REPLACEBLOCK" + subBlock.index, sub);
		    }
			
		    if ( nodename.equals("null") || nodeStr.equals("models") || nodeStr.equals("app") ) {
		    	nodename = fieldname;
		    }
    		String str = outputString.replaceAll("\\$\\{model.name\\}", nodename);
    		str = str.replaceAll("\\$\\{" + type + ".name\\}", fieldname);
    		str = str.replaceAll("\\$\\{" + type + ".camelname\\}", toCamel(fieldname));
    		str = str.replaceAll("\\$\\{" + type + ".title\\}", fieldtitle);
    		str = str.replaceAll("\\$\\{" + type + ".ref-obj\\}", getAttribute(field, "ref-obj"));

    	    String description = (String)getXpath(field, "description", XPathConstants.STRING);
    	    if ( description == null ) {
    	    	description = getAttribute(field, "description") + "";
    	    }
    	    str = str.replaceAll("\\$\\{" + type + ".description\\}", description + "");
    		str = str.replaceAll("\\$\\{" + type + ".link\\}", getAttribute(field, "link") + "");
    		str = str.replaceAll("\\$\\{" + type + ".min-searchlength\\}", getAttribute(field, "min-searchlength") + "");
	    	if ( fieldtype.equals("ref") ) {
	    		str = str.replaceAll("\\$\\{" + type + ".name-id\\}", fieldname + "._id");
	    		str = str.replaceAll("\\$\\{" + type + ".type\\}", "Schema.ObjectId, ref: '" + toCamel(getAttribute(field, "ref-obj")) + "'");
	    		str = str.replaceAll("\\$\\{" + type + ".name.deref\\}", fieldname + ".name");
	    	} else {
	    		str = str.replaceAll("\\$\\{" + type + ".name-id\\}", fieldname);
	    		str = str.replaceAll("\\$\\{" + type + ".type\\}", fieldtype);
	    		if ( fieldtype.equals("Date") ) {
		    		str = str.replaceAll("\\$\\{" + type + ".name.deref\\}", fieldname + "|date");
	    		} else {
		    		str = str.replaceAll("\\$\\{" + type + ".name.deref\\}", fieldname);
	    		}
	    	}
	    	
	    	if ( i == fields2.getLength()-1 ) {
	    		str = str.replaceAll("\\$\\{end-comma\\}", "");
	    		str = str.replaceAll("\\$\\{end-strpad\\}", "");
	    	} else {
	    		str = str.replaceAll("\\$\\{end-comma\\}", ",");
	    		str = str.replaceAll("\\$\\{end-strpad\\}", " + \" \" + ");
	    	}
	    	
	    	String formControl = getFormControl(fieldtype, getAttribute(field, "form-type"), getAttribute(field, "form-options"), nodename, fieldname, getAttribute(field, "ref-obj"), Boolean.getBoolean(getAttribute(field, "required")));
    		str = str.replaceAll("\\$\\{field.form-control\\}", formControl);
	    	strb.append(str);
	    }
	    
	    return strb.toString();
	}

	private static String getFormControl(String type, String formType, String formOptions, String modelName, String fieldName, String refName, boolean required) {

		if ( formType == null || formType.length() < 1 ) {
			formType="text";
		}
		
		String fc = "<input type=\"" + formType + "\" ng-model=\"" + modelName + "." + fieldName + "\" id=\"" + fieldName + "\"" + (required ? " ng-required=\"true\"" : "") + " class=\"form-control\"/>";
		
		if ( type.equals("ref") ) {
			fc = "<input type=\"hidden\" ui-select2=\"global." + refName + "Select\" ng-model=\"" + modelName + "." + fieldName + "\"" + (required ? " ng-required=\"true\"" : "") + "/>";
		}
		
		if ( type.equals("Date") ) {
			fc = "<input type=\"text\" ng-model=\"" + modelName + "." + fieldName + "\" id=\"" + fieldName + "\" data-date-format=\"dd/mm/yyyy\" bs-datepicker " + (required ? " ng-required=\"true\"" : "") + "/> ";
		}
		
		if ( formType.equals("checkbox") ) {
			Map<String, String> m = getFormOptions(formOptions);
			
			fc = "" + 
		        "<div class=\"btn-group\">\n" + 
		        "    <button type=\"button\" class=\"btn btn-default\" ng-model=\"" + modelName + "." + fieldName + "\" btn-radio=\"true\">" + m.get("true") + "</button>\n" + 
		        "    <button type=\"button\" class=\"btn btn-default\" ng-model=\"" + modelName + "." + fieldName + "\" btn-radio=\"false\">" + m.get("false") + "</button>\n" + 
		        "</div>\n";
		}

		if ( formType.equals("radio") ) {
			Map<String, String> m = getFormOptions(formOptions);
			
			fc = "" + 
		        "<div class=\"btn-group\">\n";
			
        	for (Map.Entry<String, String> entry : m.entrySet()) {
        	    String n = entry.getKey();
        	    String v = entry.getValue();

            	fc += "    <button type=\"button\" class=\"btn btn-default\" ng-model=\"" + modelName + "." + fieldName + "\" btn-radio=\"" + n + "\">" + v + "</button>\n";
        	}        

		    fc +=
		        "</div>";
		}

		return fc;
	}
	
	private static Map<String, String> getFormOptions(String formOptions) {
		Map<String, String> m = new LinkedHashMap<String, String>();
		
		StringTokenizer t1 = new StringTokenizer(formOptions, ",");
		while ( t1.hasMoreTokens() ) {
			String entry = t1.nextToken();
			StringTokenizer t2 = new StringTokenizer(entry, ":");
			String name = t2.nextToken();
			String value = t2.nextToken();
			
			m.put(name, value);
		}
		
		return m;
	}
	
	private static class RepeatBlock {
		int index;
		String type;
		String source;
		String block;
		String xpath;
		
		List<RepeatBlock> subBlocks;
		
		public String toString() {
			return "[type='" + type + "', xpath='" + xpath + "', block='" + block + "']";
		}
	}
	
	private static List<RepeatBlock> getRepeatBlock(String str) {
		List<RepeatBlock> rbl = new ArrayList<RepeatBlock>();

		while ( true ) {
			int pos1 = str.indexOf("${--repeat");
			
			if ( pos1 < 0 ) {
				break;
			}
			
			String theRest = str.substring(pos1+10);
			StringTokenizer tok = new StringTokenizer(theRest, ":");
			String repeatnum = tok.nextToken();
			String type = tok.nextToken();
			String xpath = tok.hasMoreTokens() ? tok.nextToken() : type;
			
			String endToken = "--" + repeatnum + "}";
			int pos2 = str.indexOf(endToken);
			String out = null;
			
			if ( pos1 > -1 && pos2 > -1 ) {
				out = str.substring(pos1+11, pos2);
			} else {
				break;
			}
			
			str = str.substring(0, pos1) + "REPLACEBLOCK" + repeatnum + str.substring(pos2+endToken.length());

			RepeatBlock rb = new RepeatBlock();
			rb.index = Integer.valueOf(repeatnum);
			rb.source = str;
			rb.block = out.substring(type.length()+1+new String(repeatnum).length()+xpath.length()+1);

			rb.type = type;
			rb.xpath = xpath;
			
			rb.subBlocks = getRepeatBlock(rb.block);
			
			rbl.add(rb);
		}
		
		return rbl;
	}
	
	private static Document getConfigXML() throws ParserConfigurationException, IOException, SAXException, XPathExpressionException  {
		File fXmlFile = new File(app_xml);
		DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
		
		System.out.println(fXmlFile.getAbsolutePath());
		
		return dBuilder.parse(fXmlFile);
	}
	
	private static Object getXpath(Node n, String expression, QName type) throws XPathExpressionException {
		
		XPathFactory factory=XPathFactory.newInstance();
		XPath xpath = factory.newXPath();
		
		XPathExpression expr = xpath.compile(expression);
	    return expr.evaluate(n, type);
	}
	private static String getAttribute(Node n, String att) {
		Node natt = n.getAttributes().getNamedItem(att);
		if ( natt == null ) {
			return null;
		}
		return natt.getTextContent();
	}

	private static void unZipSeed(String appName) throws Exception {
		
		
		String outputFolder = gen_dir + "/" + appName;
		
		System.out.println("   Unzipping seed into " + outputFolder);
		
	    File folder = new File(outputFolder);
    	if(!folder.exists()){
    		folder.mkdirs();
    	}
    	
		ZipInputStream zis = new ZipInputStream(new FileInputStream("./mean-seed.zip"));
    	ZipEntry ze = zis.getNextEntry();
 
    	byte[] buffer = new byte[1024];
    	while(ze!=null){

	    	String fileName = ze.getName();
	    		 
	        File newFile = new File(outputFolder + File.separator + fileName);
    		if ( ze.isDirectory() ) {
	            new File(newFile.getAbsoluteFile().toString()).mkdirs();
    		} 
    		else {
	            new File(newFile.getParent()).mkdirs();
	 
	            FileOutputStream fos = new FileOutputStream(newFile);             
	 
	            int len;
	            while ((len = zis.read(buffer)) > 0) {
	            	fos.write(buffer, 0, len);
	            }
	 
	            fos.close();   
        	}
            ze = zis.getNextEntry();
    	}
 
        zis.closeEntry();
    	zis.close();

		System.out.println("   Seed unzipped");
		
	}
}
