import $ from 'jquery';

export default (function Menu () {
    const toggle  = $('#sidebar-toggle');
    function toggleSidebar () {
        $('html').toggleClass('sidebar-open scroll-lock');
    }
    
    return (function () {
        toggle.click(toggleSidebar);
        $('#main-nav a').click(toggleSidebar);
    })()
})()