import $ from 'jquery';

export default class ItemTable {
    constructor () {
        this.identifier  = 'item';
        this.table       = $('#item');
        this.rows        = $('#item .row');
        this.nextButton  = $('#item-nav-buttons button.next');
        this.prevButton  = $('#item-nav-buttons button.previous');
        this.editLog     = $('#edit-log-submit')
        
        this.itemId    = $('#active-id').html();
        this.activeRow = {};
        this.init();
        this.events();
    }
    
    init () {
        $('#log .modal__header .active-name').text($('#active-name').text())
    }

    events () {
        this.rows.click(this.makeActiveRow.bind(this))
        this.nextButton.click(this.getAdjacentItem.bind(this))
        this.prevButton.click(this.getAdjacentItem.bind(this))
        this.editLog.click(this.handleRecordChange.bind(this))
        $(document).keydown(this.handleKeyPress.bind(this))
    }
    
    makeActiveRow (event) {
        this.rows.removeClass('active');
        event.currentTarget.classList.add('active');
        const id       =  this.table.find('.active .id')[0].innerText,
              date     =  this.table.find('.active .date')[0].innerText,
              added    = +this.table.find('.active .added')[0].innerText,
              removed  = +this.table.find('.active .removed')[0].innerText,
              balance  = +this.table.find('.active .balance')[0].innerText,
              comments =  this.table.find('.active .comments')[0].innerText,
              row      = {
                  id       : id,
                  date     : date,
                  added    : added,
                  removed  : removed,
                  comments : comments
              };
        this.activeRow = row;
        $('html').addClass('options-open');
        //
        $('#active-log-id').html(id);
        $('.active-log-date').html(date);
        //
        $('#u-added').val(added);
        $('#u-removed').val(removed);
        $('#u-comment').val(comments);
    }
    
    closeOptions (event) {
        this.rows.removeClass('active');
        this.activeRow = {};
        $('html').removeClass('options-open');
    }
    
    getAdjacentItem (event) {
        let direction = event.currentTarget.innerText === 'Next' ? '/next' : '/prev';
        location.assign('/items/' + this.itemName +  direction);
    }
    
    handleRecordChange () {
        const _           =  this,
              active      =  this.activeRow,
              inStock     = +$('#current-stock').text(),
              added       =  active.added,
              removed     =  active.removed;
        
        let   uAdded      =  $('#edit-log-form').find('#u-added').val(),
              uRemoved    =  $('#edit-log-form').find('#u-removed').val();
        
        if (uAdded == '') uAdded = added;
        else uAdded = Number(uAdded);
        if (uRemoved == '') uRemoved = removed;
        else uRemoved = Number(uRemoved);
        
        const addedDiff   = uAdded - added,
              removedDiff = uRemoved - removed,
              stockDiff   = addedDiff - removedDiff,
              uBalance    = inStock + stockDiff;
        
        console.log({addedDiff, removedDiff, stockDiff, uBalance})
        
        $.ajax({
            url: `/items/${_.itemId}/${active.id}`,
            method: 'PUT',
            data: { 
                added     : uAdded,
                removed   : uRemoved,
                balance   : uBalance,
                stockDiff : stockDiff
            }
        })
        .success(res => {
            if (!res.error) location.reload()
            else {
                return false
            }
        })
    }
    
    handleKeyPress (event) {
        const _       = this,
              key     = String(event.keyCode),
              state   = $('html').hasClass('options-open') ? 'options' : 'main',
              methods = {
                main: {
                    27: () => location.replace('/'),
                    73: () => $('#sidebar-toggle').trigger('click'), //'I'
                    72: () => $('.legend--toggle').first().trigger('click'), //'H'
                    76: () => $('.log--open').first().trigger('click'), //'L'
                    78: () => $('.log--open').first().trigger('click') //'N'
                },
                options: {
                    27: () => _.closeOptions(),
                    72: () => $('.legend--open').first().trigger('click'), //'H'
                    67: () => $('.edit-comment--open').first().trigger('click'),//'C'
                    69: () => $('.edit-log--open').first().trigger('click') //'E'
                }
            };
//        console.log(key);
        if ($('html').hasClass('modal-open')) {
            event.stopPropagation()
        }
        else if (typeof(methods[state][key]) == 'function') {
            methods[state][key]()
        } else {
            return false
        }
    }
}
