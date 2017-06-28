import $ from 'jquery';

export default function DayReport () {
    
    let backDate    = '',
        forwardDate = '';
    
    const d        = new Date(),
          today    = d.toISOString().substring(0,10),
          current  = location.pathname.slice(-10),
          back     = $('#back'),
          forward  = $('#forward'),
          url      = `/items/print/:date`,
          go       = date => url.replace(':date', date);
    
    const setDates = (function () {
        const d  = new Date(current);
        d.setDate(d.getDate() - 1);
        backDate    = d.toISOString().substring(0,10)
        d.setDate(d.getDate() + 2);
        forwardDate = d.toISOString().substring(0,10)
        return null;
    })();
    
    if (current == today) forward.css('display', 'none');
    
    function goBack () {location.replace(go(backDate))}
    
    function goForward () {
        if (current != today) location.replace(go(forwardDate))
    }
    function handleKeyPresses (event) {
      const code = String(event.keyCode),
            keys = {
                27: () => location.replace('/items'), //ESC
                37: () => goBack(),// LEFT ARROW
                39: () => goForward() // RIGHT ARROW
            };
      console.log(code);
      if ( typeof keys[event.keyCode] == 'function') keys[event.keyCode]();
      else return false
    }; 

    return (function () {
        $(document).keyup(handleKeyPresses);
        back.click(goBack);
        forward.click(() => location.replace(goForward));
        return { identifier: 'print' }
    })()
}