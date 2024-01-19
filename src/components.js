import {html, css, LitElement} from 'lit';
import '@zachleat/details-utils';

const baseStyles = {
  listReset: css`
    ul, ul li {
      margin: 0;
      padding: 0;
      text-indent: 0;
      list-style-type: none;
    }
  `,

  row: css`
  `
};

class ResumeRow extends LitElement {
  static styles = css`
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-s-xl);
    }

    .row > :first-child { flex-grow: 1; }
  `

  static properties = {
    justify: { type: String },
  };

  render() {
    const justify = this.justify || 'center';
    return html`
      <div class="row" style="justify-content: ${justify};">
        <div><slot name="left"></slot></div>
        <div><slot name="right"></slot></div>
      </div>
    `;
  }
}

class ResumeLink extends LitElement {
  static styles = css`
    a {
      color: var(--fg-color);
      text-decoration: none;
    }

    a:active, a:hover, a:focus {
      text-decoration: underline;
    }
  `;

  static properties = {
    href: { type: String },
  };

  render() {
    return html`
      <a target="_blank" rel="noreferrer" href="${this.href}"><slot></slot></a>
    `;
  }
}

const svgs = {
  github: html`
    <svg width="24" height="24" viewbox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor"/>
    </svg>
  `,

  email: html`
    <svg width="24" height="24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
      <rect x="4" y="7" class="outlined" width="24" height="18"/>
      <polyline class="outlined" points="8,11 16,18 24,11 "/>
      <line class="outlined" x1="13.7" y1="16" x2="8" y2="21"/>
      <line class="outlined" x1="24" y1="21" x2="18.3" y2="16"/>
    </svg>
  `,

  pin: html`
    <svg width="24" height="24" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
      <path class="outlined" d="M25,13c0,8-9,15-9,15s-9-7-9-15c0-5,4-9,9-9S25,8,25,13z"/>
      <circle class="outlined" cx="16" cy="13" r="3"/>
    </svg>
  `
};


class ResumeIcon extends LitElement {
  static styles = css`
    svg {
      position: relative;
      top: 0px;
    }

    svg .outlined {
      fill:none;
      stroke:currentColor;
      stroke-width:2;
      stroke-linejoin:round;
      stroke-miterlimit:10;
    }
  `;

  static properties = {
    icon: { type: String },
  };

  render() {
    return svgs[this.icon];
  }
}

class ResumeEntry extends LitElement {
  static styles = [
    baseStyles.listReset,
    css`
      details {
        padding: var(--space-s) var(--space-m);
        border-radius: 3px;
        transition: background-color var(--transition);
      }

      .entry:hover {
        background-color: var(--light-bg-color);
        background-color: #f4f4f7;
      }

      summary {
				display: block;
        width: 100%;
        list-style: none;

        user-select: none;
        cursor: pointer;
      }

      /* safari */
      summary::-webkit-details-marker { display: none; }

      summary::after {
        display: flex;
        justify-content: center;
        content: '⋯';
        font-weight: 500;
        font-size: 120%;
      }

      details[open] > summary::after { display: none; }

      h3 { margin-top: 0; }

      .small { font-size: 80%; }

      resume-link { font-style: italic; }
    `
  ];

  static properties = {
    caption: { type: String },
    "subcaption": { type: String },
    teaser: { type: String },
    period: { type: String },
    "link-href": { type: String },
    "link-caption": { type: String },
  }

  render() {
    return html`
      <div class="entry">
        <details-utils force-open="print">
          <details>
            <summary>
              <resume-row>
                <div slot="left">
                  <h3>${this.caption}</h3>
                  <ul class="small">
                    <li>${this['subcaption']}</li>
                    <li>${this.period}</li>
                    <li><resume-link href="${this['link-href']}">${this['link-caption']}</resume-link></li>
                  </ul>
                </div>
                <div slot="right">
                  <slot name="right"></slot>
                </div>
              </resume-row>
              <p>${this.teaser}</p>
            </summary>
            <div>
              <slot></slot>
            </div>
          </details>
        </details-utils>
      </div>
    `;
  }
}

class ResumeSectionHeader extends LitElement {
  static styles = css`
    header {
      margin-bottom: var(--space-s-xl);
    }

    h2 {
      text-align: center;
      padding-top: var(--space-2xs-xs);
      border-top: var(--border);
    }

    .intro {
      margin-inline: var(--space-m);
    }
  `;

  static properties = {
    caption: { type: String },
  };

  render() {
    return html`
      <header>
        <h2>${this.caption}</h2>
        <div class="intro"><slot></slot></div>
      </header>
    `
  }
}

customElements.define('resume-row', ResumeRow);
customElements.define('resume-link', ResumeLink);
customElements.define('resume-icon', ResumeIcon);
customElements.define('resume-entry', ResumeEntry);
customElements.define('resume-section-header', ResumeSectionHeader);
