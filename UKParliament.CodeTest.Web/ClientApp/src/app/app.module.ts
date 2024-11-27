import locale from '@angular/common/locales/en-GB';
import { CommonModule, DatePipe, registerLocaleData } from "@angular/common";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { PeopleComponent } from './components/people/people.component';
import { PersonComponent } from './components/person/person.component';

registerLocaleData(locale, 'en-GB');

@NgModule({ declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        PeopleComponent,
        PersonComponent
    ],
    bootstrap: [AppComponent], 
    imports: 
    [
        CommonModule,
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'person', component: PersonComponent },
            { path: 'person/:id', component: PersonComponent }
        ])
    ], 
    providers: [
        DatePipe,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
