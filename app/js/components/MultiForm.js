import $ from 'jquery';

export default class MultiForm {
    constructor (form, url, key) {
        this.selector  = form.trim();
        this.container = $(`#${this.selector}`);
        this.forms     = this.container.find('form');
        this.submit    = this.container.find('.submit');
        this.singles   = this.container.find('input.single');
        this.url       = `/items${url}`;
        this.key       = key;
        
        this.init();
        this.events();
    }
    
    init () {
        this.container.prepend('<p class="error"></p>');
        this.forms.attr('action', 'javacript:');
    }

    events () {
        this.submit.click(this.handle.bind(this))
    }
    handle (event) {
        event.currentTarget.setAttribute('disabled', 'disabled');
        let data = {},
            all  = [];
        
        this.singles.each(function () {
            data[$(this).attr('name')] = $(this).val().trim()
        })
        
        this.forms.each(function () {
            let temp   = {},
                inputs = $(this).find('input');
            if (inputs.eq(0).val() != '') {
                inputs.each(function () {
                    let val = $(this).attr('type') == 'number' ? +$(this).val() : $(this).val().trim();
                    temp[$(this).attr('name')] = val;
                })
                all.push(temp);
            }
        })
        
        data[this.key] = all;
        console.log(data)
        $.ajax({
            url    : this.url,
            method : 'POST',
            data   : data,
        }) 
        .success(res => {
            
            if (!res.error) {
                location.reload();
                return false
            }
            else {
                this.container.find('.error').html(res.error);
            }
        })
        .always(() => event.currentTarget.removeAttribute('disabled'))
    }
}
