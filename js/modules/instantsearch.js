/* eslint no-console: ["error", { allow: ["warn", "error", "log", "info", "table", "time", "timeEnd"] }] */

import * as global from './global.js'
import {exeJsCode} from './helpers.js';
import {pathToBreadcrumb} from './experimentation.js';

export { instantSearch }

const instantSearch = () => {
  // Variables
  const scInstantSearch = document.querySelector('.scInstantSearch')
  const divResults = document.querySelector('.scInstantSearchResults')
  let globalTimeout = null

  if (scInstantSearch && divResults) {
    
    // On blur
    scInstantSearch.addEventListener('blur', (event) => {
      	setTimeout(function () {
      		if(!document.activeElement.getAttribute("class").includes("scInstantRow")) {
        		divResults.setAttribute('style', 'height:0px; opacity: 0; visibility: hidden; top: 43px;');
        	}
      	}, 200)
    })

    // On focus
    scInstantSearch.addEventListener('focus', (event) => {
     	const chars = event.target.value.length;
     	(chars >= 2) ? divResults.setAttribute('style', 'opacity: 1; visibility: visible; top: 48px;') : false;
    })

    //Tab index
	divResults.addEventListener('keyup', (event) => {

		console.log(event.key);

		if (event.key === 'ArrowUp') {
			
			document.activeElement.nextElementSibling ? document.activeElement.previousElementSibling.focus() : false;

		} else if (event.key === 'ArrowDown') {
			
			document.activeElement.nextElementSibling ? document.activeElement.nextElementSibling.focus() : false;

		} else if (event.key === 'Enter') {
			
			let ref = event.target != null ? event.target : event.srcElement;      
	        ref ? exeJsCode(`fadeEditorFrames(); setTimeout(function() { scForm.invoke("item:load(id=` + ref.getAttribute('data-scitem') + `,language=` + ref.getAttribute('data-language') + `,version=` + ref.getAttribute('data-version') + `)") }, 150)`) : false;
	    
	    } else if (event.key === 'Escape') {
			
	        divResults.setAttribute('style', 'height:0px; opacity: 0; visibility: hidden; top: 43px;');

	    }
	});

	//Document
	document.addEventListener('keyup', (event) => {
		if (event.key === 'Escape') {
			
	        divResults.setAttribute('style', 'height:0px; opacity: 0; visibility: hidden; top: 43px;');

	    }
	});

    //Key in search box
    scInstantSearch.addEventListener('keyup', (event) => {
    	
    	// Stop if special key pressed
    	let specialKey = false
    	event.key == 'Alt' ? specialKey = true : false
    	event.key == 'Meta' ? specialKey = true : false
    	event.key == 'Control' ? specialKey = true : false
    	event.key == 'Shift' ? specialKey = true : false
    	event.key == 'CapsLock' ? specialKey = true : false
    	event.key == 'ArrowDown' ? specialKey = true : false
    	event.key == 'ArrowUp' ? specialKey = true : false
    	event.key == 'Escape' ? specialKey = true : false

    	if (event.key === 'ArrowDown') {
			
			console.log("key down");
			divResults.querySelector(".scInstantRow").focus();

		}

        const chars = event.target.value.length;
        (globalTimeout != null) ? clearTimeout(globalTimeout) : false

        globalTimeout = setTimeout(function () {
         	if (chars >= 2 && !specialKey) {
         		globalTimeout = null
         		// Preload results
            	divResults.setAttribute('style', 'opacity: 1; visibility: visible; top: 48px;')
            	divResults.innerHTML = '<div class="scInstantSeachLoading"><img loading="lazy" class="pulseAnimate" src="' + global.iconInstantSearch + '" /><span class="textLoading"><span></div>'

            	if (divResults.querySelector('.textLoading')) {
	            	var loadingTimeout1 = setTimeout(function () {
	            		divResults.querySelector('.textLoading').innerText = 'Sitecore is processing your request ...'
	            	}, 6000)

	            	var loadingTimeout2 = setTimeout(function () {
	            		divResults.querySelector('.textLoading').innerText = '... Hang tight, it takes a little longer than expected...'
	            	}, 11000)

	            	var loadingTimeout3 = setTimeout(function () {
	            		divResults.querySelector('.textLoading').innerText = '... server is warming up, bear with us :-)'
	            	}, 16000)
            	}

			    var ajax = new XMLHttpRequest()
			    ajax.timeout = 20000
			    ajax.open('GET', '/sitecore/shell/applications/search/instant/instantsearch.aspx?q=' + event.target.value + '&v=1', true)
			    ajax.onreadystatechange = function () {
			        if (ajax.readyState === 4 && ajax.status == '200') {
			        	let category, title, href, img, text, scItem, scLanguage, scVersion, showCat
			        	let html = ''
			        	let count = 0
			        	const dom = new DOMParser().parseFromString(ajax.responseText, 'text/html')
            			const results = dom.querySelectorAll('.scSearchResultsTable > tbody > tr')

            			for (const row of results) {
            				const td = row.querySelectorAll('td')

            				if (td.length == 2) {
            					showCat = true
            					// console.log("NODE -----> "+td[0].innerText);

            					category = td[0].innerText
            					title = td[1].querySelector('a').getAttribute('title')
            					href = td[1].querySelector('a').getAttribute('href')
            					img = td[1].querySelector('img').getAttribute('src')
            					text = td[1].innerText
            					// console.log("-> "+text+" "+href+" "+title+" "+img);

            					if (text.toLowerCase() != 'use classic search') {
            						// Get item language version
            						try {
            							scItem = '{' + href.split('/{')[1].split('}_')[0] + '}'
            							scLanguage = href.split('_qst_lang_eq_')[1].split('&ver_')[0]
            							scVersion = href.split('&ver_eq_')[1]
            						} catch (error) {
            							// error
            						}
            					}
            				} else {
            					showCat = false

            					title = td[0].querySelector('a').getAttribute('title')
            					href = td[0].querySelector('a').getAttribute('href')
            					img = td[0].querySelector('img').getAttribute('src')
            					text = td[0].innerText
            					// console.log("-> "+text+" "+href+" "+title+" "+img);

            					// Get item language version
            					try {
            						scItem = '{' + href.split('/{')[1].split('}_')[0] + '}'
            						scLanguage = href.split('_qst_lang_eq_')[1].split('&ver_')[0]
            						scVersion = href.split('&ver_eq_')[1]
            					} catch (error) {
            						// error
            					}
            				}

            				// Append
            				if (category.toLowerCase() == 'content' || category.toLowerCase() == 'media library' || category.toLowerCase() == 'direct hit') {
            					showCat ? html += '<h1>' + category + '</h1>' : false
            					html += '<li onclick=\'fadeEditorFrames(); setTimeout(function() { scForm.invoke("item:load(id=' + scItem + ',language=' + scLanguage + ',version=' + scVersion + ')") }, 150)\' class="scInstantRow" tabindex="0" role="link" data-scitem="' + scItem + '" data-language="' + scLanguage + '" data-version="' + scVersion + '">';
            					html += '<h2 title="' + title + '">' + text + '</h2>'
            					html += '<p title="' + title + '"><img loading="lazy" src="' + img + '" onerror="this.onerror=null;this.src=\'' + global.iconInstantSearchGeneric + '\';"/> ' + pathToBreadcrumb(title, ">", false) + '</p>'
            					html += '</li>';
            					count++
            				}
            			}

            			count == 0 ? html = '<div class="scInstansSeachLoading">No result for \"<u>' + event.target.value + '\</u>", try something else.</div>' : false

            			// Populate result
            			divResults.innerHTML = ''
            			divResults.insertAdjacentHTML('afterbegin', html)

			        } else if (ajax.status == '500') {
		              	
		              	// Populate result
            			divResults.innerHTML = ''
            			divResults.insertAdjacentHTML('afterbegin', '<div class="scInstansSeachLoading">Sorry, your Sitecore instance is not compatible with this feature :-(</div>')

		            } else if (ajax.status == '401') {
		              	
		              	// Populate result
            			divResults.innerHTML = ''
            			divResults.insertAdjacentHTML('afterbegin', '<div class="scInstansSeachLoading">Your Sitecore session has expired, <a href="#" onclick="javascript:return scForm.postEvent(this,event,\'system:logout\');">clic here to reconnect</a>.</div>')
		            
		            } else if (ajax.status == '0') {
		              	
		              	// Populate result
            			divResults.innerHTML = ''
            			divResults.insertAdjacentHTML('afterbegin', '<div class="scInstansSeachLoading">Sitecore timeout. Try again...</div>')
		            
		            }

		            (loadingTimeout1 != null) ? clearTimeout(loadingTimeout1) : false;
		            (loadingTimeout2 != null) ? clearTimeout(loadingTimeout2) : false;
		            (loadingTimeout3 != null) ? clearTimeout(loadingTimeout3) : false;
			    }
			    ajax.send(null)
         	}
        }, 1000)
    }, false)
  }
}
