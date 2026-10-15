-- Personalização e mídia real do catálogo inicial.
alter table public.profiles add column if not exists age int;
alter table public.profiles add column if not exists training_level text default 'beginner';
alter table public.exercises add column if not exists image_source text;

update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Leg press 45°';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Supino com halteres';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wide-Grip_Lat_Pulldown/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Puxada na frente';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Shoulder_Press/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Desenvolvimento sentado';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Levantamento terra romeno';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Squat/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Agachamento livre sem carga';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Push-Up/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Flexão inclinada em bancada';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Walking_Lunge/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Afundo reverso';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dead_Bug/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Dead bug';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Squat/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Agachamento goblet';
update public.exercises set image_path='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg',image_source='Free Exercise DB (Unlicense)' where name='Remada com elástico';
