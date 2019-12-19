/*
 * Sitecore Author Toolbox
 * - A Google Chrome Extension -
 * - created by Ugo Quaisse -
 * https://twitter.com/uquaisse
 * ugo.quaisse@gmail.com
 */

const multipliers = {
    'GB': 1024 * 1024 * 1024,
    'MB': 1024 * 1024,
    'KB': 1024,
    'bytes': 1,
}

const toBytes = withUnit => {
    const splited = withUnit.split(' ')
    const num = splited[0].replace(',', '')
    const unit = splited[1]
    return num * multipliers[unit]
}

const getData = () => Array.from(document.querySelectorAll('#Table1 table tr'))
    .slice(1)
    .map(e => {
        return {
            name: e.children[1].innerText,
            count: e.children[2].innerText,
            size: e.children[3].innerText,
            delta: e.children[4].innerText,
            maxSize: e.children[5].innerText,
        }
    })
    .map(d => {
        const sizeInBytes = toBytes(d.size)
        const maxSizeInBytes = toBytes(d.maxSize)
        var useRate = maxSizeInBytes === 0 ? 0 : sizeInBytes / maxSizeInBytes * 100
        
        if (isNaN(useRate)) {    
            useRate = 0;
        }

        return {
            ...d,
            useRate: Number(useRate.toFixed(2)),
            under80: useRate < 80
        }
    })

const getTotals = () => {
    const totals = document.getElementById('c_totals').innerText
    const entries = totals.match(/(?<=Entries: )[^,]+/)[0]
    const size = totals.match(/(?<=Size: ).+/)[0]
    return {
        entries: parseInt(entries),
        size: parseInt(size)
    }
}

const form = document.getElementsByTagName('form')[0]
if(document.getElementsByName('c_refresh')[0]) {
const refreshButton = document.getElementsByName('c_refresh')[0].cloneNode()
const clearAllButton = document.getElementsByName('c_clearAll')[0].cloneNode()
form.appendChild(refreshButton)
form.appendChild(clearAllButton)
}
const enhancedTable = document.createElement('div')
enhancedTable.setAttribute('id', 'enhanced-table')
document.body.appendChild(enhancedTable)

if(window.location.pathname == "/sitecore/admin/cache.aspx") {
    const iconRam = chrome.runtime.getURL("images/ram.png")
    const data = getData()
    const table = new Tabulator('#enhanced-table', {
        data: data,
        layout:"fitDataFill",      //fit columns to width of table
        responsiveLayout:"hide",  //hide columns that dont fit on the table
        tooltips:true,            //show tool tips on cells
        addRowPos:"top",          //when adding a new row, add it to the top of the table
        history:true,             //allow undo and redo actions on the table
        pagination:"local",       //paginate the data
        paginationSize:50,         //allow 7 rows per page of data
        movableColumns:true,      //allow column order to be changed
        resizableRows:true, 
        initialSort: [
            { column: 'size', dir: 'desc' }
        ],
        columns: [

            { title: 'Name', field: 'name', formatter:function(cell, formatterParams) { return "<span style='font-weight:bold;'><img src='" + iconRam + "' style='width:16px; height:16px; vertical-align: middle;' /> " + cell.getValue() + "</span>"; } },
            { title: 'Count', field: 'count' },
            { title: 'Size', field: 'size', sorter: (a, b) => toBytes(a) - toBytes(b)  },
            { title: 'Delta', field: 'delta', sorter: (a, b) => toBytes(a) - toBytes(b), formatter:function(cell, formatterParams) {
               var value = cell.getValue();
               value = value.split(" ");
                    if(value[0] > 0){
                        return "<span style='color:#DC291E; font-weight:bold;'>" + value[0] + " " + value[1] + "</span>";
                    }else{
                        return value[0] + " " + value[1];
                    }
                }
            },
            { title: 'Max size', field: 'maxSize', sorter: (a, b) => toBytes(a) - toBytes(b) },
            { title: 'Use rate', field: 'useRate', formatter: cell => cell.getValue() + " %" },
            { title: '< 80%', field: 'under80', formatter: 'tickCross'}
        ],
        rowFormatter: row => {
            const useRate = row.getData().useRate
            if (useRate < 70) {
                return;
            }
            const lightness = -1 * useRate + 165
            const cell = row.getCell('useRate').getElement()    
            cell.style.backgroundColor = `hsl(0, 100%, ${lightness}%)`
        }
    })

}