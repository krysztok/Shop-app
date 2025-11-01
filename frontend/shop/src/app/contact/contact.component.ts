import { Component, ElementRef, ViewChild } from '@angular/core';
import { Browser, Map, map, tileLayer, marker } from 'leaflet';
import { ShopsService } from './shops.service';
import { Shop } from './shop';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;
  shops!: Shop[];

  apiKey: string = "YOUR_API_KEY'" //https://www.geoapify.com/
  private initialState = { lng: 19, lat: 52, zoom: 6 };
  private lefletMap!: Map;

  constructor(private shopsService: ShopsService) {

  }

  ngOnInit() {
    this.shopsService.getShops().then((shops) => {
      if (shops) {
        this.shops = shops;

        for (let i = 0; i < this.shops.length; i++) {
          marker([this.shops[i].coords.latitude, this.shops[i].coords.longitude]).addTo(this.lefletMap)
            .bindPopup(this.shops[i].name)
        }
      }
    });
  }

  ngAfterViewInit() {
    this.lefletMap = map(this.mapContainer.nativeElement).setView([this.initialState.lat, this.initialState.lng], this.initialState.zoom);
    const isRetina = Browser.retina;
    const baseUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
    const retinaUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

    tileLayer(isRetina ? retinaUrl : baseUrl, {
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
      apiKey: this.apiKey,
      maxZoom: 20,
      id: 'osm-bright',
    } as any).addTo(this.lefletMap);

  }
}
