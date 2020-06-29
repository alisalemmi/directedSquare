import * as UI from './view/UI';
import * as Item from './model/items';

const fillPage = () => {
  UI.addSample(Item.selectSample());
  UI.addItem(Item.selectItem());
};

fillPage();

UI.setItemsClick(e => {
  const index = parseInt(e.target.getAttribute('data-num'));

  if (Item.isSelected(index)) return;

  const result = Item.select(index);
  UI.update(e.target, result);

  const finish = Item.checkFinish();
  if (finish[0] === true) alert(finish[1]);
  //TODO
  // 1- instead of alert result page should shown
  // 2- timer most stop
});
