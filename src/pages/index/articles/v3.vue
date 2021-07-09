<!-- eslint-disable -->
<template>
  <div
    v-once
    id="center"
  >
    <div class="main_tit">
      <h1 id="title">
        关于ISC BIND存在拒绝服务漏洞的安全公告
      </h1>
      <div class="info">
        <span id="pubtime">
          2020-05-29 16:57:20
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
       2020年5月22日，国家信息安全漏洞共享平台（CNVD）收录了DNS BIND拒绝服务漏洞（CNVD-2020-29429，对应CVE-2020-8617）。攻击者利用该漏洞，可使BIND域名解析服务崩溃。目前，该漏洞的利用代码已公开，厂商已发布新版本完成修复。
        </p><p style="text-align: justify; text-indent: 2em;">
        <strong>一、漏洞情况分析</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
       BIND（BerkeleyInternet Name Domain）是由美国互联网系统协会（ISC，Internet Systems Consortium）负责开发和维护的域名解析服务（DNS）软件，是现今互联网上使用较为广泛的DNS解析服务软件。
        </p><p style="text-align: justify; text-indent: 2em;">
          2020年5月22日，国家信息安全漏洞共享平台（CNVD）收录了由北京知道创宇信息技术股份有限公司报送的ISC BIND拒绝服务漏洞。由于BIND代码会对TSIG资源记录消息进行正确性检查，因此攻击者可通过发送精心构造的恶意数据，使其进程在tsig.c位置触发断言失败，导致BIND域名解析服务崩溃。攻击者利用漏洞可发起拒绝服务攻击。该漏洞对互联网上广泛应用的BIND软件构建的域名服务器构成安全运行风险。
        </p><p style="text-align: justify; text-indent: 2em;">
        CNVD对该漏洞的综合评级为“高危”。
        </p><p style="text-align: justify; text-indent: 2em;">
        <strong>二、漏洞影响范围</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
        该漏洞影响的产品版本如下：
        </p><p style="text-align: justify; text-indent: 2em;">
       BIND 9.12.0 ~ 9.12.4P2
        </p><p style="text-align: justify; text-indent: 2em;">
       BIND 9.14.0 ~ 9.14.11
        </p><p style="text-align: justify; text-indent: 2em;">
       BIND 9.16.0 ~ 9.16.2
        </p><p style="text-align: justify; text-indent: 2em;">
          BIND 9.17.0 ~ 9.17.1 实验版本分支
        </p><p style="text-align: justify; text-indent: 2em;">
          BIND 9.13 ~ 9.15 所有废弃的开发分支
        </p><p style="text-align: justify; text-indent: 2em;">
          BIND 9.9.3-S1 至 9.11.18-S1 的发行预览版
        </p><p style="text-align: justify; text-indent: 2em;">
        CNVD对DNS BIND在我国境内的分布情况进行统计，结果显示我国境内共有5571060台服务器（根据IP和端口去重）运行该DNS域名解析服务。
        </p><p style="text-align: justify; text-indent: 2em;">
     <strong>三、漏洞处置建议</strong>
        </p><p style="text-align: justify; text-indent: 2em;">
          技术创新是网信产业发展的强大支撑。
        </p><p style="text-align: justify; text-indent: 2em;">
        目前，BIND官方已发布9.11.19，9.14.12及9.16.3版本完成漏洞修复，CNVD建议用户关注厂商主页，尽快升级至新版本，避免引发漏洞相关的网络安全事件。
        </p><p style="text-align: justify; text-indent: 2em;">
       附参考链接：
        </p><p style="text-align: justify; text-indent: 2em;">
   <a href="https://www.isc.org/downloads/bind/">https://www.isc.org/downloads/bind/</a>（补丁地址）
        </p><p style="text-align: justify; text-indent: 2em;">
         <a href="https://downloads.isc.org/isc/bind9/9.11.19/BIND9.11.19.x64.zip">https://downloads.isc.org/isc/bind9/9.11.19/BIND9.11.19.x64.zip</a>
        </p><p style="text-align: justify; text-indent: 2em;">
        <a href="https://downloads.isc.org/isc/bind9/9.14.12/BIND9.14.12.x64.zip">https://downloads.isc.org/isc/bind9/9.14.12/BIND9.14.12.x64.zip</a>
        </p><p style="text-align: justify; text-indent: 2em;">
          <a href="https://downloads.isc.org/isc/bind9/9.16.3/BIND9.16.3.x64.zip">https://downloads.isc.org/isc/bind9/9.16.3/BIND9.16.3.x64.zip</a>
        </p>
    </div>
    </div>
  </div>
</template>
