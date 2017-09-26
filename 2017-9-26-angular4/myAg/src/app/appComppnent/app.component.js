"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var hero_service_1 = require("../servic/hero.service");
console.log(hero_service_1.HeroService);
var Hero = (function () {
    function Hero() {
    }
    return Hero;
}());
exports.Hero = Hero;
var HEROES = [
    { id: 11, name: 'Mr. Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
];
var AppComponent = (function () {
    function AppComponent(heroService) {
        this.heroService = heroService;
        this.name = 'Angular';
        this.title = '邵晓华 of Heroes';
        this.hero = {
            id: 1,
            name: '邵晓华'
        };
    }
    ;
    AppComponent.prototype.getHeroes = function () {
        var _this = this;
        this.heroService.getHeroes().then(function (heroes) { return _this.heroes = heroes; });
    };
    AppComponent.prototype.ngOnInit = function () {
        this.getHeroes();
    };
    AppComponent.prototype.onSelect = function (hero) {
        console.log(hero);
        this.hero = hero;
        this.selectedHero = hero;
        console.log(this.selectedHero);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n  <h1>{{title}}</h1>\n  <h2>{{hero.name}} details!</h2>\n  <div><label>id: </label><input [(ngModel)]=\"hero.name\" placeholder=\"name\"></div>\n  <div><label>name: </label>{{hero.name}}</div>\n  <div>\n    <label>name: </label>\n  </div>\n  <ul class=\"heroes\">\n    <li *ngFor=\"let hero of heroes\" \n    (click)=\"onSelect(hero)\"\n    [class.selected]=\"hero === selectedHero\">\n      <span class=\"badge\">{{hero.id}}</span> {{hero.name}}\n    </li>\n  </ul>\n  <div *ngIf=\"selectedHero\">\n    <label>name: </label>\n    <input [(ngModel)]=\"selectedHero.name\" placeholder=\"name\"/>\n  </div>\n  <br>\n  <span>\u4E0B\u9762\u662F\u4E00\u4E2A\u7EC4\u4EF6</span>\n  <hero-detail [aacc]=\"selectedHero\"></hero-detail>\n  ",
        styleUrls: ['./app.one.scss'],
        providers: [hero_service_1.HeroService]
    }),
    __metadata("design:paramtypes", [hero_service_1.HeroService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map