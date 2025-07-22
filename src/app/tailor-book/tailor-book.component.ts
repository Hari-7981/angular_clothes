// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { TailorService } from '../Services/tailor.service';
// import { Tailor } from '../interfaces/tailors.interface';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-tailor-book',
//   templateUrl: './tailor-book.component.html',
//   styleUrl: './tailor-book.component.css',
//    standalone: true,
//   imports: [
//     CommonModule,   // Provides NgFor, NgIf
//     RouterLink,     // Used if you add a "View Details" link for each tailor
//     FormsModule     // Needed for ngModel
//   ]
// })
// export class TailorBookComponent implements OnInit {
//   tailor: Tailor | undefined;
//   description: string = '';
//   cost: number | null = null;
//   name: string = '';
//   prepayment: number | null = null;
//   remaining: number | null = null;
//    loading = true;
//   error: string | null = null;

//   constructor(private route: ActivatedRoute, private tailorService: TailorService) {}

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.tailorService.getTailorById(id).subscribe({
//         next: (data) => {
//           this.tailor = data;
//           this.loading = false;
//         },
//         error: () => {
//           this.error = 'Failed to load tailor details.';
//           this.loading = false;
//         }
//       });
//     } else {
//       this.error = 'No tailor ID provided.';
//       this.loading = false;
//     }
//   }

//   bookNow() {
//     alert('Booking confirmed!');
//     // Implement booking logic here
//   }
// }
