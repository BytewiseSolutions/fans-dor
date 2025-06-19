import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HowItWorksComponent } from './components/pages/how-it-works/how-it-works.component';
import { FAQsComponent } from './components/pages/faqs/faqs.component';
import { CategoryListComponent } from './components/pages/category-list/category-list.component';
import { VoteComponent } from './components/pages/vote/vote.component';
import { VoteSuccessComponent } from './components/pages/vote-success/vote-success.component';
import { LoginComponent } from './components/pages/login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { CookiesPolicyComponent } from './components/pages/cookies-policy/cookies-policy.component';
import { EventsComponent } from './components/pages/events/events.component';
import { NewsComponent } from './components/pages/news/news.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { SupportComponent } from './components/pages/support/support.component';
import { TermsOfUseComponent } from './components/pages/terms-of-use/terms-of-use.component';
import { CategoryDetailComponent } from './components/pages/category-detail/category-detail.component';


export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'how-it-works', component: HowItWorksComponent },
      { path: 'faqs', component: FAQsComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'category/:id', component: CategoryDetailComponent },
      { path: 'vote/:nomineeId', component: VoteComponent },
      { path: 'vote-success', component: VoteSuccessComponent },
      { path: 'login', component: LoginComponent },
      { path: 'about', component: AboutComponent },
      { path: 'events', component: EventsComponent },
      { path: 'news', component: NewsComponent },
      { path: 'support', component: SupportComponent },
      { path: 'cookies-policy', component: CookiesPolicyComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'terms-of-use', component: TermsOfUseComponent },
      { path: 'contact', component: ContactComponent }
    ]
  },
  // Admin route outside layout (no navbar or footer)
  { path: 'admin-dashboard', component: AdminDashboardComponent }
];
