import { FilterMenu } from './FilterMenu'

export class FilterCollection {

  filterMenus:  Array<FilterMenu>;
  rows:         Array<HTMLElement>;
  ths:          Array<HTMLElement>;
  table:        HTMLElement;
  options:      Options;
  target:       JQuery;

  constructor (target: JQuery, options: Options) {
    this.target = target;
    this.options = options;
    this.ths = target.find('th' + options.columnSelector).toArray()
    this.filterMenus = this.ths.map(function(th: HTMLElement, index: number) {
      let column = $(th).index();
      return new FilterMenu(target, th, column, index, options);
    });
    this.rows = target.find('tbody').find('tr').toArray();
    this.table = target.get(0);
  }

  public initialize(): void {
    this.filterMenus.forEach(function(filterMenu) {
      filterMenu.initialize();
    });
    this.bindCheckboxes();
    this.bindSelectAllCheckboxes();
    this.bindSort();
    this.bindSearch();
  }

  private bindCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-menu-item.item').change(function() {
      let index = $(this).data('index');
      let value = $(this).val();
      filterMenus[index].updateSelectAll();
      updateRowVisibility(filterMenus, rows, ths);
    });
  }

  private bindSelectAllCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-menu-item.select-all').change(function() {
      let index = $(this).data('index');
      let value = this.checked;
      filterMenus[index].selectAllUpdate(value);
      updateRowVisibility(filterMenus, rows, ths);
    });
  }

  private bindSort(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let sort = this.sort;
    let table = this.table;
    let options = this.options;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-sort').click(function() {
      let $sortElement = $(this).find('span');
      let column = $sortElement.data('column');
      let order = $sortElement.attr('class');
      sort(column, order, table, options);
      updateRowVisibility(filterMenus, rows, ths);
    });
  }

  private bindSearch(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let ths = this.ths;
    let updateRowVisibility = this.updateRowVisibility;
    this.target.find('.dropdown-filter-search').keyup(function() {
      let $input = $(this).find('input');
      let index = $input.data('index');
      let value = $input.val();
      filterMenus[index].searchToggle(value);
      updateRowVisibility(filterMenus, rows, ths);
    });
  }

  private updateRowVisibility(filterMenus: Array<FilterMenu>, rows: Array<HTMLElement>, ths: Array<HTMLElement>): void {
    let showRows = rows;
    let hideRows: Array<HTMLElement> = [];
    let selectedLists = filterMenus.map(function(filterMenu) {
      return {
        column: filterMenu.column,
        selected: filterMenu.inputs
          .filter(function(input: HTMLInputElement) {
            return input.checked
          }).map(function(input: HTMLInputElement) {
            return input.value.trim().replace(/ +(?= )/g,'');
          })
      };
    });
    for (let i=0; i < rows.length; i++) {
      let tds = rows[i].children;
      for (let j=0; j < selectedLists.length; j++) {
        let content = (tds[selectedLists[j].column] as HTMLElement).innerText.trim().replace(/ +(?= )/g,'')
        if (selectedLists[j].selected.indexOf(content) === -1 ) {
          $(rows[i]).hide();
          break;
        }
        $(rows[i]).show();
      }
    }
  }

  private sort(column: number, order: string, table: HTMLElement, options: Options): void {
    let flip = 1;
    if (order === options.captions.z_to_a.toLowerCase().split(' ').join('-')) flip = -1;
    let tbody = $(table).find('tbody').get(0);
    let rows = $(tbody).find('tr').get();

    rows.sort(function(a, b) {
      var A = (a.children[column] as HTMLElement).innerText.toUpperCase();
      var B = (b.children[column] as HTMLElement).innerText.toUpperCase();

      if (!isNaN(Number(A)) && !isNaN(Number(B))) {
        // handle numbers
        if(Number(A) < Number(B)) return -1*flip;
        if(Number(A) > Number(B)) return  1*flip;
      } else {
        // handle strings
        if(A < B) return -1*flip;
        if(A > B) return  1*flip;
      }
      return 0;
    });

    for (var i=0; i < rows.length; i++) {
      tbody.appendChild(rows[i]);
    }
  }


}
