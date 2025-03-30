
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} AlignCV. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
