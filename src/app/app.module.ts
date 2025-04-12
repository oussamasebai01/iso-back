import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';
import { ToastrModule } from 'ngx-toastr';

import { TokenInterceptor } from './token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './templat/header/header.component';
import { LandingComponent } from './templat/landing/landing.component';
import { ArticlesComponent } from './templat/articles/articles.component';
import { GalleryComponent } from './templat/gallery/gallery.component';
import { FeaturesComponent } from './templat/features/features.component';
import { TestimonialsComponent } from './templat/testimonials/testimonials.component';
import { TeamComponent } from './templat/team/team.component';
import { ServicesComponent } from './templat/services/services.component';
import { SkillsComponent } from './templat/skills/skills.component';
import { WorkComponent } from './templat/work/work.component';
import { EventsComponent } from './templat/events/events.component';
import { PricingComponent } from './templat/pricing/pricing.component';
import { VideosComponent } from './templat/videos/videos.component';
import { StatsComponent } from './templat/stats/stats.component';
import { DiscountComponent } from './templat/discount/discount.component';
import { FooterComponent } from './templat/footer/footer.component';
import { NavigationComponent } from './dashbord/navigation/navigation.component';
import { MainComponent } from './dashbord/main/main.component';
import { TemplatComponent } from './templat/templat.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { RegisterComponent } from './sing/register/register.component';
import { LoginComponent } from './sing/login/login.component';
import { SingComponent } from './sing/sing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ConformanceComponent } from './dashbord/conformance/conformance.component';
import { HrComponent } from './dashbord/hr/hr.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashbordComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'conformance', component: ConformanceComponent },
      { path: 'hr', component: HrComponent }
    ]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: TemplatComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    ArticlesComponent,
    GalleryComponent,
    FeaturesComponent,
    TestimonialsComponent,
    TeamComponent,
    ServicesComponent,
    SkillsComponent,
    WorkComponent,
    EventsComponent,
    PricingComponent,
    VideosComponent,
    StatsComponent,
    DiscountComponent,
    FooterComponent,
    NavigationComponent,
    MainComponent,
    TemplatComponent,
    DashbordComponent,
    RegisterComponent,
    LoginComponent,
    SingComponent,
    NotFoundComponent,
    ConformanceComponent,
    HrComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    IonicModule.forRoot(),
    ToastrModule.forRoot(),
    NgChartsModule  
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule]
})
export class AppModule { }