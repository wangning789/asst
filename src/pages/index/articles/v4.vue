<!-- eslint-disable -->
<template>
  <div
    v-once
    id="center"
  >
    <div class="main_tit">
      <h1 id="title">
        关于Apache Tomcat存在文件包含漏洞的安全公告
      </h1>
      <div class="info">
        <span id="pubtime">
          2020-02-20 17:27:30
        </span><span id="source">来源：
          国家信息安全漏洞共享平台
        </span>

      </div>
      <div class="clear" />
    </div>
    <div
      id="content"
      class="content1"
      style="font-size: 14px;"
    >
      <div id="BodyLabel">
        <p style="text-align: justify; text-indent: 2em;">
          2020年1月6日，国家信息安全漏洞共享平台（CNVD）收录了由北京长亭科技有限公司发现并报送的Apache Tomcat文件包含漏洞（CNVD-2020-10487，对应CVE-2020-1938）。攻击者利用该漏洞，可在未授权的情况下远程读取特定目录下的任意文件。目前，漏洞细节尚未公开，厂商已发布新版本完成漏洞修复。
        </p><p style="text-align: justify; text-indent: 2em;">
          <strong>一、漏洞情况分析</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
          Tomcat是Apache软件基金会Jakarta 项目中的一个核心项目，作为目前比较流行的Web应用服务器，深受Java爱好者的喜爱，并得到了部分软件开发商的认可。Tomcat服务器是一个免费的开放源代码的Web应用服务器，被普遍使用在轻量级Web应用服务的构架中。
        </p><p style="text-align: justify; text-indent: 2em;">
          2020年1月6日，国家信息安全漏洞共享平台（CNVD）收录了由北京长亭科技有限公司发现并报送的Apache Tomcat文件包含漏洞。Tomcat AJP协议由于存在实现缺陷导致相关参数可控，攻击者利用该漏洞可通过构造特定参数，读取服务器webapp下的任意文件。若服务器端同时存在文件上传功能，攻击者可进一步实现远程代码的执行。
        </p><p style="text-align: justify; text-indent: 2em;">
          CNVD对该漏洞的综合评级为“高危”。
        </p><p style="text-align: justify; text-indent: 2em;">
        <strong>二、漏洞影响范围</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
         漏洞影响的产品版本包括：
        </p><p style="text-align: justify; text-indent: 2em;">
           Tomcat 6
        </p><p style="text-align: justify; text-indent: 2em;">
           Tomcat 7
        </p><p style="text-align: justify; text-indent: 2em;">
           Tomcat 8
        </p><p style="text-align: justify; text-indent: 2em;">
          Tomcat 9
        </p><p style="text-align: justify; text-indent: 2em;">
          CNVD平台对Apache Tomcat AJP协议在我国境内的分布情况进行统计，结果显示我国境内的IP数量约为55.5万，通过技术检测发现我国境内共有43197台服务器受此漏洞影响，影响比例约为7.8%。
        </p><p style="text-align: justify; text-indent: 2em;">
          <strong>三、漏洞处置建议</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
          目前，Apache官方已发布9.0.31、8.5.51及7.0.100版本对此漏洞进行修复，CNVD建议用户尽快升级新版本或采取临时缓解措施：
        </p><p style="text-align: justify; text-indent: 2em;">
          <strong>1.&nbsp;&nbsp; 如未使用Tomcat AJP协议：</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
          如未使用 Tomcat AJP 协议，可以直接将 Tomcat 升级到 9.0.31、8.5.51或 7.0.100 版本进行漏洞修复。
        </p><p style="text-align: justify; text-indent: 2em;">
          如无法立即进行版本更新、或者是更老版本的用户，建议直接关闭AJPConnector，或将其监听地址改为仅监听本机localhost。
        </p><p style="text-align: justify; text-indent: 2em;">
         具体操作：
        </p><p style="text-align: justify; text-indent: 2em;">
          （1）编辑 &lt;CATALINA_BASE&gt;/conf/server.xml，找到如下行（&lt;CATALINA_BASE&gt; 为 Tomcat 的工作目录）：
        </p><p style="text-align: justify; text-indent: 2em;">
         &lt;Connector port="8009"protocol="AJP/1.3" redirectPort="8443" /&gt;
        </p><p style="text-align: justify; text-indent: 2em;">
          （2）将此行注释掉（也可删掉该行）：
        </p><p style="text-align: justify; text-indent: 2em;">
           &lt;!--&lt;Connectorport="8009" protocol="AJP/1.3"redirectPort="8443" /&gt;--&gt;
        </p><p style="text-align: justify; text-indent: 2em;">
         （3）保存后需重新启动，规则方可生效。
        </p><p style="text-align: justify; text-indent: 2em;">
         <strong>2.&nbsp;&nbsp; 如果使用了Tomcat AJP协议：</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
         &lt;Connector port="8009"protocol="AJP/1.3" redirectPort="8443"address="YOUR_TOMCAT_IP_ADDRESS" secret="YOUR_TOMCAT_AJP_SECRET"/&gt;
        </p><p style="text-align: justify; text-indent: 2em;">
          如无法立即进行版本更新、或者是更老版本的用户，建议为AJPConnector配置requiredSecret来设置AJP协议认证凭证。例如（注意必须将YOUR_TOMCAT_AJP_SECRET更改为一个安全性高、无法被轻易猜解的值）：
        </p><p style="text-align: justify; text-indent: 2em;">
     附：参考链接：
        </p>
        <p style="text-align: justify; text-indent: 2em;">
        <a href="https://tomcat.apache.org/connectors-doc/ajp/ajpv13a.html">https://tomcat.apache.org/connectors-doc/ajp/ajpv13a.html</a>
        </p>
        <p style="text-align: justify; text-indent: 2em;">
       <a href="https://tomcat.apache.org/tomcat-8.0-doc/config/ajp.html">https://tomcat.apache.org/tomcat-8.0-doc/config/ajp.html</a>
        </p>
        <p style="text-align: justify; text-indent: 2em;">
        <a href="https://stackoverflow.com/questions/21757694/what-is-ajp-protocol-used-for">https://stackoverflow.com/questions/21757694/what-is-ajp-protocol-used-for</a>
        </p>
    </div>
    </div>
  </div>
</template>
