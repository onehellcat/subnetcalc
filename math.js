/**
*FIXME:
*TODO: 
*HACK:
*NOTE:
*REVIEW:
*DEBUG:
* * Better Comments 
* ! Better Comments
* ? Better Comments
* TODO  Better Comments 
* @param Better Comments
*/

var nAddr = new Array(10,0,0,0);
	var nMask = new Array(255,0,0,0);


   
	function displayInfo() {
		try {
			document.getElementById("network").value = nAddr[0]+"."+nAddr[1]+"."+nAddr[2]+"."+nAddr[3];
			document.getElementById("mask").value = nMask[0]+"."+nMask[1]+"."+nMask[2]+"."+nMask[3];
			var wc = wildcardMask(nMask);
			document.getElementById("wildcard").value = wc[0]+"."+wc[1]+"."+wc[2]+"."+wc[3];
			var cidr = octet2cidr(nMask);
			document.getElementById("maskbits").value = "/" + cidr;
			document.getElementById("hosts").value = hostCount(nMask);
			var aSubnet = subnetID(nAddr,nMask);
			document.getElementById("subnetID").value = aSubnet[0]+"."+aSubnet[1]+"."+aSubnet[2]+"."+aSubnet[3];
			var aBcast = broadcast(nAddr,wc);
			document.getElementById("broadcast").value = aBcast[0]+"."+aBcast[1]+"."+aBcast[2]+"."+aBcast[3];
			var aStart = startingIP(nAddr,nMask);
			document.getElementById("startIP").value = aStart[0]+"."+aStart[1]+"."+aStart[2]+"."+aStart[3];
			var aEnd = endingIP(nAddr,wc);
			document.getElementById("endIP").value = aEnd[0]+"."+aEnd[1]+"."+aEnd[2]+"."+aEnd[3];
			populateMaskSelect( document.getElementById('maskSelect'), nAddr, nMask[0]+"."+nMask[1]+"."+nMask[2]+"."+nMask[3]);
			populateHostsSelect( document.getElementById('hostsSelect'), nAddr,cidr);
		} catch(e) {
			if( confirm("Error: Debug the stack trace?") ) {
				stackTrace(e);
			}
		}
	}


    function wildcardMask(aMask){
		var a = new Array(0,0,0,0);
		for(var i=0;i<4;i++){
			a[i] = 255 - aMask[i];
		}
		return a;
	}



    function endingIP(aNet,aWild){
		// work around int32
		var a = new broadcast(aNet,aWild);
		var d = octet2dec(a);
		d = d-1;
		return dec2octet(d);
	}




    function broadcast(aNet,aWild){
		// work around int32
		var a = new Array(0,0,0,0);
		for(var i=0;i<4;i++){
			a[i] = aNet[i] | aWild[i];
		}
		return a;
	}



    function startingIP(aNet,aMask){
		var a = subnetID(aNet,aMask);
		var d = octet2dec(a);
		d = d+1;
		return dec2octet(d);
	}



    function subnetID(aNet,aMask){
		var a = new Array(0,0,0,0);
		for(var i=0;i<4;i++){
			a[i] = aNet[i] & aMask[i];
		}
		return a;
	}



    function hostCount(aMask) {
		var bits = 32 - octet2cidr(aMask);
		// get # of addresses in network and subtract 2
		return Math.pow(2,bits) -2;
	}


    function octet2cidr(aMask) {
		var mask = octet2dec(aMask);
		// get binary string
		mask = mask.toString(2);
		// return mask length
		return mask.indexOf(0);
	}



    function cidr2octet(bits) {
		var bits = parseInt(bits);
		if( bits < 0 | bits > 32 ) {
			alert("Invalid 32 bit DIDR mask.  You entered "+bits);
			return false;
		}
		// make up our mask
		var ones = "11111111111111111111111111111111";
		var mask = parseInt(ones.substring(0,bits),2);
		var shift = 32-bits;
		// poor mans bit shift because javascript uses 32 bit integers
		mask = mask * Math.pow(2,shift);

		return dec2octet(mask);
	} 




    function octet2dec(a){
		//alert("octet2dec1 "+a[0]+"\n"+dec2bin(a[0])+"\n"+dec2bin(a[0] * 16777216));
		// poor mans bit shifting (Int32 issue)
		var d = 0;
		d = d + parseInt(a[0]) * 16777216 ;  //Math.pow(2,24);
		d = d + a[1] * 65536;	  //Math.pow(2,16);
		d = d + a[2] * 256;	   //Math.pow(2,8);
		d = d + a[3];
		return d;
	}



    function dec2octet(d){
		//alert("d="+d+" "+d.toString(2)+"="+d.toString(2).substring(0,8)+"="+parseInt(d.toString(2).substring(0,8),2));
		var zeros = "00000000000000000000000000000000";
		var b = d.toString(2);
		var b = zeros.substring(0,32-b.length) + b;
		var a = new Array(
			parseInt(b.substring(0,8),2)	// 32 bit integer issue (d & 4278190080)/16777216   //Math.pow(2,32) - Math.pow(2,24);
			, (d & 16711680)/65536	  //Math.pow(2,24) - Math.pow(2,16);
			, (d & 65280)/256		 //Math.pow(2,16) - Math.pow(2,8);
			, (d & 255)
			);		  //Math.pow(2,8);
		return a;
	}


    function dec2bin(d) {
		var b = d.toString(2);
		return b;
	}



    function bin2dec(b) {
		return parseInt(b,2);
	}
	function calculateClass( c ) {
		switch(c)
		{
			case "B":
				nAddr = new Array(172,168,0,1);
				nMask = new Array(255,255,0,0);
				break;
			case "C":
				nAddr = new Array(192,168,0,1);
				nMask = new Array(255,255,255,0);
				break;
			default:
				// default to class A
				nAddr = new Array(10,0,0,1);
				nMask = new Array(255,0,0,0);
				break;
		}
		displayInfo();
	}


    function calculateIPCIDR(ip) {
		
		var x = mask.value;
		var re = new RegExp("^([0-9]{1,3}\.){3}[0-9]{1,3}(( ([0-9]{1,3}\.){3}[0-9]{1,3})|(/[0-9]{1,2}))$");
		if( !re.test(mask.value) ) {
			var s = "Use IP & CIDR Netmask: 10.0.0.1/22";
			s += "\nOr IP & Netmask: 10.0.0.1 255.255.252.0";
			//s += "\nOr IP & Wildcard Mask: 10.0.0.1 0.0.3.255";
			mask.focus();
			mask.select();
			return false;
		}
		

		var ipa = ip.split('/');
		if( ipa.length = 2 ) {
			var a = ipa[0].split('.');
			nAddr[0] = parseInt(a[0]);
			nAddr[1] = parseInt(a[1]);
			nAddr[2] = parseInt(a[2]);
			nAddr[3] = parseInt(a[3]);
			nMask = cidr2octet(ipa[1]);
		} else {
			nAddr = ip.split('.');
		}
		displayInfo();
	}
	
	function calculateSubnet(mask) {
		var a = mask.split('.');
		nMask[0] = parseInt(a[0]);
		nMask[1] = parseInt(a[1]);
		nMask[2] = parseInt(a[2]);
		nMask[3] = parseInt(a[3]);
		displayInfo();
	}
	function calculateHosts(cidr) {
		nMask = cidr2octet(cidr);
		displayInfo();
	}

	// functions to build drop downs
	function populateMaskSelect( s, aNet, maskString) {
		s.length = 0;
		var a = new Array(0,0,0,0);
		var i = 0;
		if( aNet[0] >= 1 && aNet[0] <= 126 ) {
			//class A
			a[i++] = 255;
		} else if( aNet[0] >= 128 && aNet[0] <= 191 ){
			//class B
			a[i++] = 255;
			a[i++] = 255;
		} else if( aNet[0] >= 192 && aNet[0] <= 223 ){
			//class C
			a[i++] = 255;
			a[i++] = 255;
			a[i++] = 255;
		}

		

		while( i < 4 ) {
			var t = a[0]+"."+a[1]+"."+a[2]+"."+a[3];
			addOption(s,t,t);
			var pow = 7;
			while(pow >= 0 && !(i==3 && pow<2 )) {
				a[i] = a[i] + Math.pow(2,pow);
				t = a[0]+"."+a[1]+"."+a[2]+"."+a[3];
				addOption(s,t,t);
				pow--;
			}
			i++;
		}
		selectOption(s,maskString);
	}
	function populateHostsSelect(s,aNet,cidr){
		s.length = 0;
		var pow = 8;
		if( aNet[0] >= 1 && aNet[0] <= 126 ) {
			//class = 'A';
			pow = 24;
		} else if( aNet[0] >= 128 && aNet[0] <= 191 ){
			//class = 'B';
			pow = 16;
		} else if( aNet[0] >= 192 && aNet[0] <= 223 ){
			//class = 'C';
			pow = 8;
		}
		var t = 2;
		while(pow > 2 ) {
			t = Math.pow(2,pow) -2;
			addOption(s,t,32-pow);
			pow--;
		}
		selectOption(s,cidr);
	}
	function addOption(s,t,v){
		var o = document.createElement('option');
		o.text = t;
		o.value = v;
		try {
			s.add(o, null); // standards compliant; doesn't work in IE
		} catch(e) {
			s.add(o); // IE only
		}
	}
	function selectOption(s,v){
		for (var i=0;i<s.length;i++){
			if(s[i].value == v){
				s.selectedIndex = i;
				break;
			}
		}
	}
	
	// displays a stack trace for an exception
	function stackTrace( e ) {
		var r = '';
		for (var p in e) {
			r += p + ': ' + e[p] + '\n';
		}
		alert(r);
		//console.log, console.debug, console.info, console.warn, and console.error.
	}


