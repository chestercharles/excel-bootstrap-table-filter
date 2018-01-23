export class FilterMenu {

  th:                 HTMLElement;
  tds:                Array<HTMLElement>;
  column:             number;
  index:              number;
  menu:               HTMLElement;
  inputs:             Array<Element>;
  selectAllCheckbox:  Element;
  searchFilter:       Element;
  options:            Options;
  target:             JQuery;

  constructor (target: JQuery, th: HTMLElement, column: number, index: number, options: Options) {
    this.options = options;
    this.th = th;
    this.column = column;
    this.index = index;
    this.tds = target.find('tbody tr td:nth-child(' + (this.column + 1) + ')').toArray();
  }

  public initialize(): void {
    this.menu = this.dropdownFilterDropdown();
    this.th.appendChild(this.menu);

    // variables for click handlers
    let $trigger = $(this.menu.children[0]);
    let $content = $(this.menu.children[1]);
    let $menu = $(this.menu);

    // toggle hide/show when the trigger is clicked
    $trigger.click(() => $content.toggle());

    $(document).click(function(el) {
      // hide the content if the user clicks outside of the menu
      if (!$menu.is(el.target) && $menu.has(el.target).length === 0) {
        $content.hide();
      }
    });
  }

  public searchToggle(value: string): void {
    if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = false;
    if (value.length === 0){
      this.toggleAll(true);
      if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = true;
      return;
    }
    // deselect all checkboxes initially
    this.toggleAll(false);
    // select checkboxes that match the search parameter
    this.inputs.filter(function(input: HTMLInputElement) {
      return input.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
    }).forEach(function(input: HTMLInputElement) {
      input.checked = true;
    });
  }


  public updateSelectAll(): void {
    if (this.selectAllCheckbox instanceof HTMLInputElement) {
      // clear search parameters, if any
      $(this.searchFilter).val('');
      // Check if all inputs are selected
      this.selectAllCheckbox.checked = (this.inputs.length === this.inputs.filter(function(input: HTMLInputElement) {
        return input.checked;
      }).length);
    }
  }

  public selectAllUpdate(checked: boolean): void {
    // clear search parameters, if any
    $(this.searchFilter).val('');
    this.toggleAll(checked);
  }

  private toggleAll(checked: boolean): void {
    // loop through all inputs and check or uncheck each
    for (var i=0; i < this.inputs.length; i++) {
      let input = this.inputs[i];
      if (input instanceof HTMLInputElement) input.checked = checked;
    }
  }

  private dropdownFilterItem(td: HTMLElement, self: any): HTMLElement {
    // build holder div
    let value = td.innerText;
    let dropdownFilterItem = document.createElement('div');
    dropdownFilterItem.className = 'dropdown-filter-item';
    // build input
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.value = value.trim().replace(/ +(?= )/g,'');
    input.setAttribute('checked','checked');
    input.className = 'dropdown-filter-menu-item item';
    // get index of td element
    input.setAttribute('data-column', self.column.toString());
    input.setAttribute('data-index', self.index.toString());
    // append input to holding div
    dropdownFilterItem.appendChild(input);
    dropdownFilterItem.innerHTML = dropdownFilterItem.innerHTML.trim() + ' ' +  value;
    return dropdownFilterItem;
  }

  private dropdownFilterItemSelectAll(): HTMLElement {
    // build holder div
    let value = this.options.captions.select_all;
    let dropdownFilterItemSelectAll = document.createElement('div');
    dropdownFilterItemSelectAll.className = 'dropdown-filter-item';
    // build input
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.value = this.options.captions.select_all;
    input.setAttribute('checked','checked');
    input.className = 'dropdown-filter-menu-item select-all';
    input.setAttribute('data-column', this.column.toString());
    input.setAttribute('data-index', this.index.toString());
    // append input to holding div
    dropdownFilterItemSelectAll.appendChild(input);
    dropdownFilterItemSelectAll.innerHTML = dropdownFilterItemSelectAll.innerHTML + ' ' +  value;
    return dropdownFilterItemSelectAll;
  }

  private dropdownFilterSearch(): HTMLElement {
    // build holder div
    let dropdownFilterItem = document.createElement('div');
    dropdownFilterItem.className = 'dropdown-filter-search';
    // build input
    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'dropdown-filter-menu-search form-control';
    input.setAttribute('data-column', this.column.toString());
    input.setAttribute('data-index', this.index.toString());
    input.setAttribute('placeholder', this.options.captions.search);
    // append input to holding div
    dropdownFilterItem.appendChild(input);
    return dropdownFilterItem;
  }

  private dropdownFilterSort(direction: string): HTMLElement {
    // build holder div
    let dropdownFilterItem = document.createElement('div');
    dropdownFilterItem.className = 'dropdown-filter-sort';
    // build span
    let span = document.createElement('span');
    span.className = direction.toLowerCase().split(' ').join('-');
    span.setAttribute('data-column', this.column.toString());
    span.setAttribute('data-index', this.index.toString());
    span.innerText = direction;
    // append input to holding div
    dropdownFilterItem.appendChild(span);
    return dropdownFilterItem;
  }

  private dropdownFilterContent(): HTMLElement {
    let self = this;
    // build holder div
    let dropdownFilterContent = document.createElement('div');
    dropdownFilterContent.className = 'dropdown-filter-content';

    let innerDivs = this.tds.reduce(function(arr, el) {
      // get unique values in column
      let values = arr.map((el) => el.innerText.trim());
      if (values.indexOf(el.innerText.trim()) < 0) arr.push(el);
      // return unique values
      return arr;
    }, [])
    .sort(function(a, b) {
      // sort values for display in dropdown
      var A = a.innerText.toLowerCase();
      var B = b.innerText.toLowerCase();

      if (!isNaN(Number(A)) && !isNaN(Number(B))) {

        // handle numbers
        if(Number(A) < Number(B)) return -1;
        if(Number(A) > Number(B)) return  1;

      } else {

        // handle strings
        if(A < B) return -1;
        if(A > B) return  1;

      }
      //return a.innerText.toLowerCase() > b.innerText.toLowerCase() ? 1 : -1;
      return 0;
    })
    // create dropdown filter items out of each value
    .map( (td) => {
      return this.dropdownFilterItem(td, self);
    })

    // map inputs to instance, we will need these later
    this.inputs = innerDivs.map((div) => div.firstElementChild);

    // add a select all checkbox
    let selectAllCheckboxDiv = this.dropdownFilterItemSelectAll();
    // map the select all  checkbox to the instance, we will need it later
    this.selectAllCheckbox = selectAllCheckboxDiv.firstElementChild;
    // the checkbox will precede the other inputs
    innerDivs.unshift(selectAllCheckboxDiv);

    let searchFilterDiv = this.dropdownFilterSearch();
    this.searchFilter = searchFilterDiv.firstElementChild;

    // create outer div, and place all inner divs within it
    let outerDiv = innerDivs.reduce(function(outerDiv, innerDiv) {
      outerDiv.appendChild(innerDiv);
      return outerDiv;
    }, document.createElement('div'));
    outerDiv.className = 'checkbox-container';

    let elements: Array<HTMLElement> = [];
    if (this.options.sort  ) elements= elements.concat([
      this.dropdownFilterSort(this.options.captions.a_to_z),
      this.dropdownFilterSort(this.options.captions.z_to_a)
      ]);
    if (this.options.search) elements.push(searchFilterDiv);

    return elements.concat(outerDiv).reduce(function(html, el) {
        html.appendChild(el);
        return html;
    }, dropdownFilterContent);
  }

  private dropdownFilterDropdown(): HTMLElement {
    // build holder div
    let dropdownFilterDropdown = document.createElement('div');
    dropdownFilterDropdown.className = 'dropdown-filter-dropdown';
    let arrow = document.createElement('span');
    arrow.className = 'glyphicon glyphicon-arrow-down dropdown-filter-icon';
    let icon = document.createElement('i');
    icon.className = 'arrow-down';
    arrow.appendChild(icon);
    dropdownFilterDropdown.appendChild(arrow);
    dropdownFilterDropdown.appendChild(this.dropdownFilterContent());

    if ($(this.th).hasClass('no-sort')) {
      $(dropdownFilterDropdown).find('.dropdown-filter-sort').remove();
    }
    if ($(this.th).hasClass('no-filter')) {
      $(dropdownFilterDropdown).find('.checkbox-container').remove();
    }
    if ($(this.th).hasClass('no-search')) {
      $(dropdownFilterDropdown).find('.dropdown-filter-search').remove();
    }
    return dropdownFilterDropdown;
  }

}
