import React from 'react';

const Footer = () => (
  <footer className="footer clearfix" style={{backgroundColor:'#5cb85c'}}>
    <section className="footer-credits">
      <div className="container" style={{color:'white'}}>
        &copy; {(new Date()).getFullYear()} 12PM Lunch. All rights reserved.
          </div>
    </section>
  </footer>)

export default Footer;