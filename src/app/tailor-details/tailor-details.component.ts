import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TailorService } from '../Services/tailor.service';
import { Tailor } from '../interfaces/tailors.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tailor-details',
  templateUrl: './tailor-details.component.html',
  styleUrl: './tailor-details.component.css',
  standalone: true,
  imports: [
    CommonModule,   // Provides NgFor, NgIf
   // RouterLink      // Used if you add a "View Details" link for each tailor
  ]
})
export class TailorDetailsComponent implements OnInit {
  tailor: Tailor | undefined;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private tailorService: TailorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
     this.loading = true;
    this.error = null;
    if (id) {
      this.tailorService.getTailorById(id).subscribe({
        next: (data : any) => {
          this.tailor = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load tailor details.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'No tailor ID provided.';
      this.loading = false;
    }
  }

  bookTailor() {
    if (this.tailor) {
      this.router.navigate(['/tailor-book', this.tailor.id]);
    }
  }
}
