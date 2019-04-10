import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonIcon } from '@ionic/react';
import { ListItem } from '../declarations';

const items: ListItem[] = [
  'flask',
  'wifi',
  'beer',
  'football',
  'basketball',
  'paper-plane',
  'american-football',
  'boat',
  'bluetooth',
  'build'
].map((_item, index, iconList) => ({
  title: `Item ${index}`,
  note: `This is item #${index}`,
  icon: iconList[Math.floor(Math.random() * iconList.length)]
}));

const List: React.SFC = () => (
  <>
  <IonHeader>
    <IonToolbar>
      <IonButtons slot="start">
        <IonMenuButton></IonMenuButton>
      </IonButtons>
      <IonTitle>
        List
      </IonTitle>
    </IonToolbar>
  </IonHeader>

  <IonContent>
    <IonList>
      { items.map((item) => (
      <IonItem>
        <IonIcon name={item.icon} slot="start"></IonIcon>
        {item.title}
        <div className="item-note" slot="end">
          {item.note}
        </div>
      </IonItem>
      ))}
    </IonList>
  </IonContent>
  </>
);

export default List;
