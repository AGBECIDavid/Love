/* =========================================================================
   Nos souvenirs — galerie 3D (défilé « coverflow »), mosaïque et visionneuse.
   Aucune dépendance. Les médias vivent dans img_life/ ; les vignettes 560 px
   dans img_life/thumbs/ ; « lqip » est l'aperçu flou affiché pendant le
   chargement. Pour ajouter un souvenir : dépose le fichier, génère sa
   vignette, puis ajoute une entrée dans MEDIA.
   ========================================================================= */
'use strict';
(function(){

const MEDIA = [
  { type:'photo', src:'img_life/photo-01.jpeg', thumb:'img_life/thumbs/photo-01.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xAB3AAADAQEBAQAAAAAAAAAAAAAGBQQHAQACAQADAQEAAAAAAAAAAAAAAAACBAMAARAAAQIFAwICCwEAAAAAAAAAAQIAAxEEEkEhMVHhsXJh0ZGSgXETFEJSM2IyEQACAgIDAQAAAAAAAAAAAAABABFBAyESYTEi/8AAEQgAGgAUAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8AvixRBCihIBH+c+/VllNFMaECogq2VJid6YV6VgzJyJhQ4be9VlyUDzSNyOdOzRx8o+iSSZ3XTYxSSW/B8t8w84WoKMwpSZ4n0cs/7V6+jbZs1SRDKEZAJPDIKaKdIcpkiaeNBk4YhX/vHhS31IT8+n8CuxfKSPpfuopKqJEuCU7D7hvnIar6Cr/Ee0PS9mfnpQf/2Q==' },
  { type:'photo', src:'img_life/photo-02.jpeg', thumb:'img_life/thumbs/photo-02.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABrAAADAQEBAQAAAAAAAAAAAAAHBQYEAQACAQEBAAAAAAAAAAAAAAAAAAACAxAAAQMDAQcBCQEAAAAAAAAAAQIAEQMxIVFBEhNCcdHBoVKxBIGR0mEiFHIRAQEAAAAAAAAAAAAAAAAAAAAR/8AAEQgAGgAUAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8AG0wpl34CvKTTVtEjqGH4O/AydHR0OLQVvkFIyBI7sVWC8a9Ac4fz/RQ9sevZi3fSskmE/jPgh+/TX0P3MQl/TTToiEpBIuoXnbJmzU1CmoCicH6Gc3th6gAELwLz89Wg5z/jyW0DCkU0kBN424u9nFTp7nCa9X1oa//Z' },
  { type:'video', src:'img_life/video-01.mp4', poster:'img_life/video-01-poster.jpg', thumb:'img_life/thumbs/video-01.jpg',
    lqip:'data:image/jpeg;base64,/9j//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABsAAACAwEBAAAAAAAAAAAAAAAFBAYHAgMAAQEBAQEAAAAAAAAAAAAAAAACAQMAEAABAwIDBwUBAQAAAAAAAAABABECAwQhMRJhQRRRcaHR8eHBkVJigREBAQEBAAAAAAAAAAAAAAAAAAERIf/AABEIACQAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ALiubgUI4B5HL3UKp305SaoAxcOOiK3weX+KBEEsBtWdbSDpuqj5LHE1OSgdSUycHy3OlHqf13WWU1z3VSLnIsq8lNtL7/RN1S+KBykSBs+VVlwdjaVJjVq0vuBPhdeCqfvufCWpXEYxaT4J3iae36U6JI4g9UBlgUe5oFUzXAGkrDrxXNMX/9k=' },
  { type:'photo', src:'img_life/photo-03.jpeg', thumb:'img_life/thumbs/photo-03.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABpAAEBAQEBAQAAAAAAAAAAAAAGBwMFAgQBAQEBAQAAAAAAAAAAAAAAAAQCAAMQAAIBAgQFBQEAAAAAAAAAAAECABEDITFREmEEIkGRMnJicfATEQEBAQEBAAAAAAAAAAAAAAAAASEREv/AABEIABoAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/AKJXax8+IqN0AYYk/sdIL5ligLDMAwYvMsqrQmpOtQR9QUqNUBqsScM5ltM59XwK1oQDPO67xkekccq/fNxemgPyhIW0Vq7u+A04Qort/UdR9Q7nWMr2Q98FbYZFMUnaMEym1W0SS60SVzOc++s562P/2Q==' },
  { type:'photo', src:'img_life/photo-04.jpeg', thumb:'img_life/thumbs/photo-04.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABuAAEBAQEAAAAAAAAAAAAAAAAFBgcEAQEBAQEAAAAAAAAAAAAAAAADAQACEAACAQMBBQYHAQAAAAAAAAABAgMRACESQXExkVJRImHBBNLRsZKioTMUExEBAQEBAQEAAAAAAAAAAAAAABEBEgIh/8AAEQgAGgAUAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8A0ONlEaVIFQoFTTZZWpY5XZmA7uKnxFzUmiZYE2qKkEHgV+dxxkMpkc0NTQA7BwAG4XysrY0WQqKFAN2r81F9GibrT6T7rE9Dr/wXJwSNnmLo6N2n7fhZ1YwiFmLmjmpr3mOee61v5EGWxnqHPjcm2JDTGB5WjF+wbjZaXzvxs8ZVFC6WxtFc+OCM9t9Otel+be6zfTkmMZtSz6aP/9k=' },
  { type:'photo', src:'img_life/photo-05.jpeg', thumb:'img_life/thumbs/photo-05.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABqAAEBAQEBAAAAAAAAAAAAAAAFBAMGAgEBAQEAAAAAAAAAAAAAAAAAAwIAEAACAAMFCAIDAQAAAAAAAAABAgARAyESMUEEE5GBUTJSwXFiIiNC0TMRAQEBAQAAAAAAAAAAAAAAAAABETH/wAARCAAaABQDASIAAhEAAxEA/9oADAMBAAIRAxEAPwBDW6iqtWoFKhWOBE70sxyh2iWrUwTNWIB4xxRRX1H5XN1jjmfjy4wrR1biqQw+srR2WynPMSg7wmD3VrxBOBIjC6Yvq1FWo9o6jK0YRJtk5jeIPWcrtiSJjAgxXtL9uAAk1st58QBF6f5VfULUSqCwb9Qcrb2XGPE17F3N/YJXpX15jWZgla//2Q==' },
  { type:'photo', src:'img_life/photo-06.jpeg', thumb:'img_life/thumbs/photo-06.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAUQBQAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABvAAACAgMBAAAAAAAAAAAAAAAGBQQDAQACBwEBAQEBAQAAAAAAAAAAAAAAAgMBAAQQAAEDAgMHAwUBAAAAAAAAAAECABEDIRIxQYEEodHBcVEjUvCxJCJhE5IRAQEBAAAAAAAAAAAAAAAAAAAREv/AABEIACQAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/AD9Jkl2nTv0YJu29GqtQsL27PRXqVTWSfxAxBJiIMHUXuxo4PnrHd3XgpJCySR5k8f1k2f8AVHwOlB5sumKFT05MZkatwDliqYcQvYAi+dzM7H5cCcUBRG13qqLXAKiQD0flilHFYV0qhIUkRkPrYkXza/7nyvix6Doojap4hXuP+lPHKEjVxubmJcTm0BmH0+XlyN//2Q==' },
  { type:'photo', src:'img_life/photo-07.jpeg', thumb:'img_life/thumbs/photo-07.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABuAAEBAQEAAAAAAAAAAAAAAAAFBgcEAQEBAQEAAAAAAAAAAAAAAAADAQACEAACAQMBBQYHAQAAAAAAAAABAgMRACESQXExkVJRImHBBNLRsZKioTMUExEBAQEBAQEAAAAAAAAAAAAAABEBEgIh/8AAEQgAGgAUAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8A0ONlEaVIFQoFTTZZWpY5XZmA7uKnxFzUmiZYE2qKkEHgV+dxxkMpkc0NTQA7BwAG4XysrY0WQqKFAN2r81F9GibrT6T7rE9Dr/wXJwSNnmLo6N2n7fhZ1YwiFmLmjmpr3mOee61v5EGWxnqHPjcm2JDTGB5WjF+wbjZaXzvxs8ZVFC6WxtFc+OCM9t9Otel+be6zfTkmMZtSz6aP/9k=' },
  { type:'video', src:'img_life/video-02.mp4', poster:'img_life/video-02-poster.jpg', thumb:'img_life/thumbs/video-02.jpg',
    lqip:'data:image/jpeg;base64,/9j//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABxAAACAgMBAAAAAAAAAAAAAAAFAwcBAAQCBgEBAQEBAAAAAAAAAAAAAAAABAEDABAAAQMDAgQGAwEAAAAAAAAAAQIAEQMxIRJR8HEEoSIyI5HBsWJBYUIRAQACAwEBAAAAAAAAAAAAAAARAQIxIQPR/8AAEQgAJAAUAwEiAAIRAAMRAP/aAAwDAQACEQMRAD8ADJpawpSiVKSrO8G3dgjKCpHEFlF1E1j6ZPiklPweLsaaYpi5Kvy+nhaY45V6TPI0CEiS+JbklGZE5P7b9VPYOwXLQprUJuBfHb+tSqlSpIkkXh7aaqUhQMpmxF31gplGTvAD7SX0Bl5LS8y0DpQ6tCUaoAPMc34IHTTMORev/wBcbuNz5PZn+tLDnTt01M3/2Q==' },
  { type:'photo', src:'img_life/photo-08.jpeg', thumb:'img_life/thumbs/photo-08.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABvAAEBAQEBAAAAAAAAAAAAAAAFAgcGAwEBAQEBAQAAAAAAAAAAAAAAAwUCAQQQAAEDAgQDCQEAAAAAAAAAAAECABEDEgRRIWETFDEicdGhcmLwQkEyEQACAwEBAQAAAAAAAAAAAAABABICYRMhUf/AABEIABoAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ANIl8jisTiKS+wlFoF0k6mOo2bgqJsCiQNI1zeaVOLjMRYQpNNOo0iR3/svio9dXSsLSFDoQC/aXwfG5cBAECNg5535IYyx9ET9ZACwAc2gsECST7Rmd9mS2Kn9I9Hg3iCQxehFLYiWVFSVm4z9RAAyh1wjkfJsh09xDP7Xx/9k=' },
  { type:'photo', src:'img_life/photo-09.jpeg', thumb:'img_life/thumbs/photo-09.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABsAAACAwEBAQAAAAAAAAAAAAAHBQMABgIIBAEBAQEAAAAAAAAAAAAAAAAAAwIFEAABBAEDBAMBAQAAAAAAAAABAhEDACESBLFhMSITcUHBUTIRAAMAAgMBAAAAAAAAAAAAAAABETECQQMiYf/AABEIABoAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ADBClSFFw2P25bfb6WCZCI9OSlwRnyLN8Wrlmgg0kmRQLhZ7t1H31ubkVHPpLBRPc9eR/aTcG19X4Gy2/GlbpFm1CsGCEgKBdsjuc81JAkCRtfsU+fEJA+GqvckuA+HHNQ7Mn3y5P+lcmy2Y3Qnc8HoQLveuh5SiVFyTn7sdmm9D/9k=' },
  { type:'photo', src:'img_life/photo-10.jpeg', thumb:'img_life/thumbs/photo-10.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABwAAADAQEBAAAAAAAAAAAAAAAHBgQCBQMBAQEBAAAAAAAAAAAAAAAAAAMEARAAAQMCBQMDBQEAAAAAAAAAAQIAEQMhEgQTQTFxkvAiUWEjBVLBoWIRAAICAgMBAAAAAAAAAAAAAAARASECMWEDkTL/wAARCAAaABQDASIAAhEAAxEA/9oADAMBAAIRAxEAPwAkZZATmKm9oB+AW7sa1qwy9VYEyoEJgGB1OzxX+7aBP0sSQrDOKD1iP2xxqBLkJQIPBBe2Iao1impSUoJWkKsSLlw6VT8l9xbXwZ6La65qZjSK8XqjEox3F9NeQrVEesSLmxsenhaBzVveVqn55cSiQVDYcDYM84+YaplHXO5TtWwnJQogYMQSLACbD2frp1f9/wBdmWJ0x5sH2JPuWrJD/9k=' },
  { type:'photo', src:'img_life/photo-11.jpeg', thumb:'img_life/thumbs/photo-11.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABzAAADAQEBAQAAAAAAAAAAAAAHBgMFAgAIAQEBAQEAAAAAAAAAAAAAAAADAgEEEAACAQMCAwYHAQAAAAAAAAABAgMAERIxBCFBUSIyBZHBYbFxFIFS0XITEQACAwEBAQEAAAAAAAAAAAAAARECIVFBA8H/wAARCAAaABQDASIAAhEAAxEA/9oADAMBAAIRAxEAPwAk7VcZpevoDTtSAs8UG6KMbF7heBtrzOg9q4k8VWJnyjOCnHIEXPK+J5X96NYi9YQq9UEcOoYaMAR96tSGHztJN9RuRGva46k66/qqSxFlIlWW979grjfqbi+vGkJu+39v60XPDZHeAZMzcDqSfjR3rCUcH+dlsr3sfg+baQLCinhZQPKtb/ZetA/cswZbE90c/nWNm35HzNNByux//9k=' },
  { type:'photo', src:'img_life/photo-12.jpeg', thumb:'img_life/thumbs/photo-12.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABtAAADAQEBAQAAAAAAAAAAAAAHBgUEAQADAQEBAQAAAAAAAAAAAAAAAAADBAIQAAEDAgUCBgMBAAAAAAAAAAECEQADBBIxQVFxIQUTIpFh8NGxFaGBEQADAQEBAAAAAAAAAAAAAAAAESEBAkH/wAARCAAaABQDASIAAhEAAxEA/9oADAMBAAIRAxEAPwAjUEYbpWvlIHHSPMQF1qdtcjE4B8oYE6DNsh7zJV7umm58JRQCzuAeQlsv9hZMEuhKnohI7rSUkEpUlw4430mj9nR2V/PuUGAUXFcquTTxPiUC5OT5gk6Siqwr1EkHqHd0no3z3iQrrcKfWoX9JGqqKSoAkBsgWHpC65nN8ZRxqep1IJyEKwpCMQSAABt8M+2CruqdtifCRwPwJVc7xyQ//9k=' },
  { type:'video', src:'img_life/video-03.mp4', poster:'img_life/video-03-poster.jpg', thumb:'img_life/thumbs/video-03.jpg',
    lqip:'data:image/jpeg;base64,/9j//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xACBAAACAwEBAAAAAAAAAAAAAAAGBQQDBwIAAQADAAMBAAAAAAAAAAAAAAAFAgQAAQMGEAABAgMFBAcJAQEAAAAAAAABAgMAESEEMRJBEyJRBUJSwbFhkYHw4aHi0VQUcTNyFXMRAAIBBAMBAQAAAAAAAAAAAAABAhESIZEx4WJRQf/AABEIACQAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/AIVr4gm1oCQtSCVYik1AkJBIMh3nOO+F2oM4mlGjkgFJ2pE0FOuA1VhdZcAliHSTX0YMW7KGZOzUMhKeIk7hG7lQbI2tNqXZXNHRDoQAAqdSO+l84T/6KvpR4/DGispZdQFK2TUbR2jLM+cTtGzdJPj7IzIly+rZkzVrfUKJ1Lq3SnmZXw2aQFkqtBBUkYkSogHOmZ3EwoLhao0Ugml13durA8XsaCHKSO+pjokkCZynJRo8PlfobG1sjnT2xz92z0x74SI0sIwmQlkB1isX7G9XgPlFNQPZH1vop4kBiCs1IQo/k0PZAQvbcRPmAJ874OuJcn/JvrgHP7G/5T2mJT1RKUopkBcBFOor1OPOXxEhwOf/2Q==' },
  { type:'photo', src:'img_life/photo-13.jpeg', thumb:'img_life/thumbs/photo-13.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABvAAACAwEBAAAAAAAAAAAAAAADBwQABQYIAQEBAQAAAAAAAAAAAAAAAAADBAIQAAEDAwMDBAMBAAAAAAAAAAECEQADITESQQQiUWEFkYETsfBxUhEAAgICAwEAAAAAAAAAAAAAAAEhEhECIqED4f/AABEIABoAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/AGNRQE8pW/SQD4tO4nBVKqONyXIUzNYO1snxIq/V0IWnUghCiRqJu/kNv/YSgSWMiWZiORTWHCh82h/tR/pPuIxg8/VqxXyjTDq1EFr53Eg1KaqietKrEHbTi5752b5mIskVVly/UX3fTmMHWs+nqUVK1MLuXz3zD3WKyUeey5ZXfwgCoQ9t7WhPtP68oJGC2PwITUrufeLYmqf/2Q==' },
  { type:'photo', src:'img_life/photo-14.jpeg', thumb:'img_life/thumbs/photo-14.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xAB8AAADAQAAAAAAAAAAAAAAAAAEBgcFAQEBAQEBAAAAAAAAAAAAAAADAAECBBAAAgAEAwQGCwEAAAAAAAAAAQIDEQASIQQTQWFSUTGxU6HRIgUUQzSRwaKB8HJxYhEAAQQCAQUBAAAAAAAAAAAAAREAIQJBAzHBYaEE8BL/wAARCAAaABQDASIAAhEAAxEA/9oADAMBAAIRAxEAPwBzckWMQAEMvt00oN6ZW7ywiV4iZE7wJVlF4yxNVorFG9nst38pddB6UNrEDLIiYudFtHImeHXuoqwDmX6cyXXoUdIyB16D+SNGXVPIWjlECNEEz5sGmMd4/lHes5ftO81K0/PytGzKaQVS+O0cp9Eq29bKqAHhPgALkk6tLbsONTrMe9xP38Kf4IBy7H/bfKutkUCynV3rhbwSFGOz0IWiwJSHElM8A7p0bbD7OJ9HjSjEYggAkYbKCvbiPxNaNdSBHlpbdcEheCnAf//Z' },
  { type:'photo', src:'img_life/photo-15.jpeg', thumb:'img_life/thumbs/photo-15.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABsAAADAQEBAAAAAAAAAAAAAAAEBQcGAQIBAQEBAAAAAAAAAAAAAAAAAAMCBBAAAQMBBwMFAQAAAAAAAAAAAQIAAxExISJBYVEScZEEcrJEQsFjEQEBAAIDAQAAAAAAAAAAAAABABECIWFRM//AABEIABoAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/AG8mAFY+t9zHh85E5KSkoUMjfXoWT5M8YSRdioK5Gu3RzoVjVVJFTbYaDVqaswZKrPj8QSCSME3HNsMO4cx0vnCSDwAKEkDTkrZqlKCYzSwgaV7ZMlRIQkf1V7AwPjp9X69AcZ7l1+Y+2uhxRpNbb2dTV4aAkItNpbLkdz3eRov/2Q==' },
  { type:'photo', src:'img_life/photo-16.jpeg', thumb:'img_life/thumbs/photo-16.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABvAAADAQEAAAAAAAAAAAAAAAAHAAUGBAEBAQEAAAAAAAAAAAAAAAAABAMCEAACAgIBAwIGAwEAAAAAAAABAhEDAAQhIkESUnEUMjGBoZFy8GFREQACAgIDAQEAAAAAAAAAAAABABECIVFBMTKREv/AABEIABoAFAMBIgACEQADEQD/2gAMAwEAAhEDEQA/ACimxVrqxscIC3E9/YDL9V1Vwmt1eP8AhnAdc3xD1WFh0qfIccMe8T+s7NAMu5KDpKnyj6f2YyYMYUxiU6Y445digCvW2GoDI3D9REKeZ7yJ/OVkfbEKFrUiIZa4MekgcRmAsd694eDMkxPiSJ47xmsptsOyZdz0+o/5hrAk+udArK2qBH4GBsj6nCtw6z9j751Tme1/kP8AI5WzfSV//9k=' },
  { type:'photo', src:'img_life/photo-17.jpeg', thumb:'img_life/thumbs/photo-17.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAJwAoAAD//gAQTGF2YzYyLjI4LjEwMgD/2wBDAAgYGBwYHCEhISEhISckJygoKCcnJycoKCgrKyszMzMrKysoKCsrMDAzMzc5NzQ0MzQ5OTw8PEhIRUVUVFdnZ3z/xABwAAACAwEBAAAAAAAAAAAAAAAHBQYCBAEDAQEBAQEAAAAAAAAAAAAAAAACAwUBEAABAwIEBQQDAQAAAAAAAAABAhEDAAQSIRMxYZGhcTNBUlEU0eHBIhEAAgIDAQAAAAAAAAAAAAAAAQAhEWExAgT/wAARCAAaABQDASIAAhEAAxEA/9oADAMBAAIRAxEAPwCYzyC3RibESQkDbM8fisltc65UhScKhmG2P7pnexCSCRLsQMSTxGfXahBbTYlhIdDEKz9SPSlZa7TOqPEa8dEUs1Zfek9xtwyau6svuTyP5oQ9l23ksZiKXdSgwCf9HpQq0plF0wMzMS6Tyz51J4fKnsanDUq3hldAZlE5uFxkpILiqfcV8HrVbvzyd/5SWtcefkgSXKPo6BMB/9k=' },
  { type:'photo', src:'img_life/photo-18.jpeg', thumb:'img_life/thumbs/photo-18.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAbABQDASIAAhEBAxEB/8QAGQAAAwADAAAAAAAAAAAAAAAAAAIFAQME/8QAJBAAAgICAQMEAwAAAAAAAAAAAQIDEQASIQQxQQUTFCJRYXH/xAAVAQEBAAAAAAAAAAAAAAAAAAACAf/EABgRAQEBAQEAAAAAAAAAAAAAAAABAiES/9oADAMBAAIRAxEAPwB+rJID0C2t5xP8qMKZmtasIfF4eoCVZORddiPGNPI06qdaZgLJwejmU9mJYk88+cMzLDIHP0J/gvDFwOqUfVQ/ZpW1ZjwrfjG3j9va+44/QyX3kYnvePCNt9uaIrBcSHNGk2LsfkKBfAF4ZuigiZbZATeGVH//2Q==' },
  { type:'photo', src:'img_life/photo-19.jpeg', thumb:'img_life/thumbs/photo-19.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAbABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAIEAwX/xAAjEAACAQMEAwADAAAAAAAAAAABAgADESEEEiMxIkFRE2Fx/8QAFwEBAQEBAAAAAAAAAAAAAAAAAgEDBP/EABkRAAMBAQEAAAAAAAAAAAAAAAABERIDIf/aAAwDAQACEQMRAD8AfWvxK3jcG3dsYkmoNVS5quDtQdC1vQH7jcFakEquFcKNzE5J+D7M9UnFdnZgQBYZg1HBTym1HTolNfyV1RzkqxGISSlRFVd7kZOCwuSIS2Eg1DRVNS+/eu3rdbr+S1tHTRRyM4AOJdYBQAAAOgJmiKpuBnrJnO+zppg5pRyfGnYeh8hOkYQbYof/2Q==' },
  { type:'photo', src:'img_life/photo-20.jpeg', thumb:'img_life/thumbs/photo-20.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wAARCAAbABQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAABAACAwX/xAAhEAACAQMEAwEAAAAAAAAAAAABAgADBBESISJBE1FhMf/EABYBAQEBAAAAAAAAAAAAAAAAAAIDAf/EABoRAAIDAQEAAAAAAAAAAAAAAAARARITITH/2gAMAwEAAhEDEQA/AN3jKtJXC6RnHHuFvi5qBccWQbn4JseOugDvioF5ZOAPgHc5XWtT5Xcb5AOPcFuoURxiFs3cZSsjD8yJQVKl5U1bDo7kSiZiJLSrcVARoOO85CxjWjqih6wKgb8Y5KaU0CooUehC2zF3bUc42kNZ9HUGehTU6BsJT0yq+hKT0Gj/2Q==' },
  { type:'video', src:'img_life/video-04.mp4', poster:'img_life/video-04-poster.jpg', thumb:'img_life/thumbs/video-04.jpg',
    lqip:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gAPTGF2YzYxLjMuMTAwAP/bAEMAGxIUFxQRGxcWFx4cGyAoQisoJSUoUTo9MEJgVWVkX1VdW2p4mYFqcZBzW12FtYaQnqOrratngLzJuqbHmairpP/bAEMBHB4eKCMoTisrTqRuXW6kpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpP/AABEIACQAFAMBIgACEQEDEQH/xAAYAAEBAQEBAAAAAAAAAAAAAAAABAMBAv/EACQQAAIDAAEDAwUAAAAAAAAAAAECAAMRIQQxQQUSURMiMlJx/8QAFgEBAQEAAAAAAAAAAAAAAAAAAQID/8QAHBEBAAIBBQAAAAAAAAAAAAAAAAEREgIhMTJB/9oADAMBAAIRAxEAPwDK0FKi5Yd+Zi99bUh0bcAB/s8XXW2UqyrqseR8zouFQtb2EEg+0jxxJs0yqdmQE6T8xPHT32V1BVAI7+YiHRfctv06/ub8czclF/T9Q9SK6Ko8sTsrrqrpBYDnuWPczLp706gPy2A5jTLPe6aV4iOLiruAYIl5RP1ESMzSX1KxuKwcUjTnmOmQKnHmIjPWBHKkDiIiXpiKav/Z' },
];

/* ---------- Pont avec la page (particules dorées, musique) ---------- */
const BR = window.PourToi || {};
const REDUCED = BR.reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const burst = BR.burst || function(){};
const duck  = BR.duck  || function(){};

const deck     = document.getElementById('deck');
const flowFoot = document.getElementById('flowFoot');
const counter  = document.getElementById('flowCount');

/* ---------- Construction des cartes ---------- */
const cards = MEDIA.map((m, i) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'card';
  card.style.setProperty('--i', i);
  card.dataset.index = i;
  card.setAttribute('aria-label',
    (m.type === 'video' ? 'Vidéo ' : 'Photo ') + (i + 1) + ' sur ' + MEDIA.length + ' — ouvrir en grand');

  const frame = document.createElement('div');
  frame.className = 'card-frame';
  frame.style.backgroundImage = 'url(' + m.lqip + ')';

  const img = document.createElement('img');
  img.alt = '';
  img.decoding = 'async';
  img.loading = i < 6 ? 'eager' : 'lazy';
  img.src = m.thumb;
  img.addEventListener('load', () => card.classList.add('loaded'), { once: true });
  img.addEventListener('error', () => { img.remove(); card.classList.add('loaded', 'failed'); }, { once: true });
  if (img.complete) card.classList.add('loaded');
  frame.appendChild(img);

  if (m.type === 'video'){
    const play = document.createElement('span');
    play.className = 'card-play';
    play.setAttribute('aria-hidden', 'true');
    play.textContent = '▶';
    frame.appendChild(play);
  }
  const veil = document.createElement('span');
  veil.className = 'card-veil'; veil.setAttribute('aria-hidden', 'true');
  const glow = document.createElement('span');
  glow.className = 'card-glow'; glow.setAttribute('aria-hidden', 'true');
  frame.appendChild(veil);

  card.appendChild(frame);
  card.appendChild(glow);
  card.addEventListener('click', () => {
    if (mode === 'flow') goTo(i);        // le défilé se recentre derrière la visionneuse
    openViewer(i, card);
  });
  deck.appendChild(card);
  return card;
});

/* =========================================================================
   Vue « cercle » : défilé 3D façon coverflow
   ========================================================================= */
const N = cards.length;
let mode = 'flow';
let pos = 0, target = 0, raf = 0, dragging = false;
let spacing = 160, depth = 150;

function wrapOffset(off){ return off - Math.round(off / N) * N; }

function measure(){
  const w = cards[0].offsetWidth || 200;
  spacing = w * 0.60;
  depth   = w * 0.62;
}

function layout(){
  for (let i = 0; i < N; i++){
    const card = cards[i];
    const off  = wrapOffset(i - pos);
    const a    = Math.abs(off);
    const dir  = off < 0 ? -1 : 1;
    const soft = Math.min(a, 3.4);

    const x  = off * spacing * (1 + 0.05 * soft);
    const z  = -soft * depth - (a > 0.5 ? 30 : 0);
    const ry = -dir * Math.min(a, 1.5) * 38;
    const sc = Math.max(0.6, 1 - soft * 0.085);
    const op = a > 4.4 ? 0 : Math.min(1, 1.6 - Math.max(0, a - 3) * 1.2);

    card.style.transform = 'translate3d(calc(-50% + ' + x.toFixed(1) + 'px), -50%, ' + z.toFixed(1) + 'px)'
                         + ' rotateY(' + ry.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
    card.style.opacity = op.toFixed(2);
    card.style.zIndex = String(1000 - Math.round(a * 10));
    card.style.pointerEvents = op < 0.15 ? 'none' : 'auto';
    card.style.setProperty('--veil', Math.min(0.8, a * 0.33).toFixed(2));
    card.classList.toggle('is-front', a < 0.5);
  }
  const idx = ((Math.round(pos) % N) + N) % N;
  counter.textContent = (idx + 1) + ' / ' + N;
}

function tick(){
  raf = 0;
  if (!dragging){
    pos += (target - pos) * 0.14;
    if (Math.abs(target - pos) < 0.0015) pos = target;
  }
  layout();
  if (dragging || pos !== target) raf = requestAnimationFrame(tick);
}
function kick(){ if (!raf) raf = requestAnimationFrame(tick); }

function goTo(i, instant){
  target = pos + wrapOffset(i - pos);
  if (instant || REDUCED){ pos = target; layout(); } else kick();
}
function step(d){ target += d; kick(); }

/* --- Glisser / relâcher avec inertie --- */
let dragId = null, dragX = 0, dragStart = 0, dragPos = 0, lastX = 0, lastT = 0, vel = 0, moved = 0;

deck.addEventListener('pointerdown', (e) => {
  if (mode !== 'flow' || e.button) return;
  dragId = e.pointerId; dragging = true; moved = 0;
  dragX = lastX = e.clientX; dragStart = e.clientY;
  dragPos = pos; vel = 0; lastT = performance.now();
  deck.classList.add('dragging');
  deck.setPointerCapture(dragId);
  kick();
});
deck.addEventListener('pointermove', (e) => {
  if (!dragging || e.pointerId !== dragId) return;
  const dx = e.clientX - dragX;
  moved = Math.max(moved, Math.abs(dx));
  pos = dragPos - dx / spacing;
  const now = performance.now(), dt = Math.max(16, now - lastT);
  vel = (lastX - e.clientX) / spacing / (dt / 1000);
  lastX = e.clientX; lastT = now;
});
function endDrag(e){
  if (!dragging || (e && e.pointerId !== dragId)) return;
  dragging = false;
  deck.classList.remove('dragging');
  const throwBy = Math.max(-4, Math.min(4, vel * 0.32));
  target = Math.round(pos + throwBy);
  kick();
}
deck.addEventListener('pointerup', endDrag);
deck.addEventListener('pointercancel', endDrag);
/* un vrai glissement ne doit pas ouvrir la visionneuse */
deck.addEventListener('click', (e) => { if (moved > 8){ e.stopPropagation(); e.preventDefault(); moved = 0; } }, true);

/* --- Molette horizontale / trackpad --- */
let wheelLock = 0;
deck.addEventListener('wheel', (e) => {
  if (mode !== 'flow') return;
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
  if (!d) return;
  e.preventDefault();
  const now = performance.now();
  if (now - wheelLock < 260) return;
  wheelLock = now;
  step(d > 0 ? 1 : -1);
}, { passive: false });

/* --- Clavier --- */
deck.setAttribute('tabindex', '0');
deck.addEventListener('keydown', (e) => {
  if (mode !== 'flow') return;
  if (e.key === 'ArrowLeft'){ e.preventDefault(); step(-1); }
  else if (e.key === 'ArrowRight'){ e.preventDefault(); step(1); }
});
document.getElementById('flowPrev').addEventListener('click', () => step(-1));
document.getElementById('flowNext').addEventListener('click', () => step(1));

window.addEventListener('resize', () => { measure(); if (mode === 'flow') layout(); });

/* =========================================================================
   Vue « mosaïque »
   ========================================================================= */
const gridIO = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        setTimeout(() => el.classList.add('seen'), REDUCED ? 0 : (Number(el.dataset.index) % 4) * 90);
        obs.unobserve(el);
      });
    }, { root: document.getElementById('letter'), threshold: 0.1 })
  : null;

/* Filet de sécurité : si l'observateur ne rend jamais la main, la mosaïque
   resterait vide (les cartes naissent à opacity 0). On révèle alors ce qui est
   à l'écran — et tout le reste si l'observateur n'a rien signalé du tout. */
function gridSafety(){
  if (mode !== 'grid') return;
  const vh = window.innerHeight;
  const observerWorks = cards.some((c) => c.classList.contains('seen'));
  cards.forEach((c, i) => {
    if (c.classList.contains('seen')) return;
    const r = c.getBoundingClientRect();
    const onScreen = r.bottom > 0 && r.top < vh;
    if (observerWorks && !onScreen) return;
    setTimeout(() => c.classList.add('seen'), REDUCED ? 0 : (i % 4) * 90);
  });
}

function setMode(next){
  if (next === mode) return;
  mode = next;
  deck.classList.toggle('is-flow', mode === 'flow');
  deck.classList.toggle('is-grid', mode === 'grid');
  flowFoot.hidden = mode !== 'flow';
  document.querySelectorAll('.gal-modes button').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
  });

  if (mode === 'grid'){
    if (raf){ cancelAnimationFrame(raf); raf = 0; }
    cards.forEach((c) => {
      c.style.transform = ''; c.style.opacity = ''; c.style.zIndex = '';
      c.style.pointerEvents = ''; c.style.removeProperty('--veil');
      c.classList.remove('is-front');
      c.querySelector('img').loading = 'lazy';
      if (gridIO) gridIO.observe(c); else c.classList.add('seen');
    });
    setTimeout(gridSafety, 450);
  } else {
    cards.forEach((c) => c.classList.remove('seen'));
    measure(); layout(); kick();
  }
}
document.querySelectorAll('.gal-modes button').forEach((b) => {
  b.addEventListener('click', () => setMode(b.dataset.mode));
});

/* =========================================================================
   Visionneuse : transition fondue/morphée, effet Ken Burns, mode cinéma
   ========================================================================= */
const viewer   = document.getElementById('viewer');
const stageBox = document.getElementById('viewMedia');
const viewCount= document.getElementById('viewCount');
const bar      = document.getElementById('viewProgress');
const cineBtn  = document.getElementById('viewCine');
const PHOTO_MS = 6500;
const SHOW_MS  = 4000;            // pendant le cadeau : un rythme plus vif

let vIndex = -1, cine = false, cineTimer = 0, lastCard = null;

/* Le « spectacle » : le défilé se joue seul, du premier au dernier souvenir,
   puis rend la main à birthday.js pour le grand cœur. */
let showMode = false, showEnd = null;

let watchTimer = 0;

function clearCine(){
  if (cineTimer){ clearTimeout(cineTimer); cineTimer = 0; }
  if (watchTimer){ clearTimeout(watchTimer); watchTimer = 0; }
}

/* Filet de sécurité des vidéos. Une vidéo enchaîne normalement sur « ended »,
   mais si le navigateur refuse de la lancer (iPhone en économie d'énergie,
   onglet en veille), cet évènement ne vient jamais. On tient donc une montre :
   la durée réelle du film, sinon 20 s, et on passe au souvenir suivant. */
function watchVideo(v){
  if (!v || !cine) return;
  const arm = (ms) => {
    if (watchTimer) clearTimeout(watchTimer);
    watchTimer = setTimeout(() => { if (cine && vIndex >= 0) stepViewer(1); }, ms);
  };
  arm(20000);
  v.addEventListener('loadedmetadata', () => {
    if (cine && isFinite(v.duration) && v.duration > 0) arm(v.duration * 1000 + 2500);
  }, { once: true });
  const played = v.play();
  if (played && played.catch) played.catch(() => { if (cine) arm(2500); });
}

function armCine(kind){
  clearCine();
  bar.classList.remove('run');
  if (!cine) return;
  if (kind === 'video'){ watchVideo(stageBox.querySelector('video')); return; }
  const ms = showMode ? SHOW_MS : PHOTO_MS;
  bar.style.setProperty('--dur', (ms / 1000) + 's');
  void bar.offsetWidth;                               // relance l'animation
  bar.classList.add('run');
  cineTimer = setTimeout(() => stepViewer(1), ms);
}

/* Un souvenir qui ne s'ouvre pas : on le dit joliment, et le spectacle continue. */
function showBroken(){
  stageBox.classList.remove('loading');
  stageBox.style.backgroundImage = '';
  stageBox.innerHTML =
    '<div class="view-broken" role="status">' +
      '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M5 9.1 C1.3 6.5 0.4 4.6 1.7 3.1 ' +
      'C2.8 1.8 4.3 2 5 3.3 C5.7 2 7.2 1.8 8.3 3.1 C9.6 4.6 8.7 6.5 5 9.1 Z"/></svg>' +
      '<p>Ce souvenir n\u2019a pas pu s\u2019ouvrir.</p>' +
    '</div>';
  duck(false);
  clearCine();
  if (cine) watchTimer = setTimeout(() => { if (cine && vIndex >= 0) stepViewer(1); }, 2400);
}

function paint(i){
  const m = MEDIA[i];
  stageBox.innerHTML = '';
  if (m.type === 'video'){
    const v = document.createElement('video');
    v.src = m.src; v.poster = m.poster;
    v.controls = true; v.autoplay = true; v.playsInline = true;
    v.addEventListener('play',  () => duck(true));
    v.addEventListener('pause', () => duck(false));
    v.addEventListener('ended', () => { duck(false); if (cine) stepViewer(1); });
    v.addEventListener('error', showBroken);
    stageBox.appendChild(v);
    duck(true);
    armCine('video');
  } else {
    const img = document.createElement('img');
    img.src = m.src; img.alt = 'Souvenir ' + (i + 1) + ' sur ' + MEDIA.length;
    img.decoding = 'async';
    img.addEventListener('error', showBroken);
    /* L'aperçu flou tient la place, à la bonne taille, le temps que l'image arrive */
    stageBox.classList.add('loading');
    if (m.lqip) stageBox.style.backgroundImage = 'url(' + m.lqip + ')';
    const done = () => { stageBox.classList.remove('loading'); stageBox.style.backgroundImage = ''; };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
    stageBox.appendChild(img);
    duck(false);
    armCine('photo');
  }
  viewCount.textContent = (i + 1) + ' / ' + MEDIA.length;
  stageBox.style.viewTransitionName = 'souvenir';
  preload(i + 1); preload(i - 1);
}

function preload(i){
  const m = MEDIA[((i % MEDIA.length) + MEDIA.length) % MEDIA.length];
  const im = new Image();
  im.src = m.type === 'video' ? m.poster : m.src;
}

/* Morphing natif quand le navigateur le sait faire (View Transitions API).
   Filet de sécurité : si le navigateur tarde à rendre la main, on applique
   le changement quand même — la visionneuse s'ouvre toujours. */
function morph(fromEl, run){
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    if (fromEl) fromEl.style.viewTransitionName = '';
    run();
  };
  if (REDUCED || !document.startViewTransition || document.hidden){ go(); return; }
  if (fromEl) fromEl.style.viewTransitionName = 'souvenir';
  let t;
  try { t = document.startViewTransition(go); } catch (e){ go(); return; }
  setTimeout(go, 400);
  t.finished.catch(() => {}).finally(() => { if (fromEl) fromEl.style.viewTransitionName = ''; });
}

/* La visionneuse est une fenêtre modale : tant qu'elle est ouverte, le reste
   de la page est inerte (ni clic, ni tabulation, ni lecteur d'écran) et le
   focus tourne en boucle sur ses propres boutons. */
const BEHIND = ['intro', 'letter', 'topbar'];
function setBehindInert(on){
  BEHIND.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.inert = on;                            // ignoré par les vieux navigateurs
  });
}

function trapFocus(e){
  const items = Array.prototype.filter.call(
    viewer.querySelectorAll('button'), (el) => el.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  const here = document.activeElement;
  if (e.shiftKey && (here === first || !viewer.contains(here))){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (here === last || !viewer.contains(here))){ e.preventDefault(); first.focus(); }
}

function openViewer(i, card){
  if (vIndex >= 0) return;
  lastCard = card || cards[i];
  const r = lastCard.getBoundingClientRect();
  if (r.width) burst(r.left + r.width / 2, r.top + r.height / 2);
  vIndex = i;
  morph(lastCard.querySelector('.card-frame'), () => {
    paint(i);
    document.body.classList.add('view-open');
    setBehindInert(true);
    requestAnimationFrame(() => viewer.classList.add('in'));
    setTimeout(() => {
      /* Pendant le spectacle, « Fermer » est masqué : le point d'entrée clavier
         est « Passer ». Sinon, c'est « Fermer ». */
      const first = showMode ? document.getElementById('viewSkip')
                             : document.getElementById('viewClose');
      if (first) first.focus({ preventScroll: true });
    }, 60);
  });
}

function closeViewer(){
  if (showMode){ endShow(); return; }                 // fermer, c'est passer au cœur
  if (vIndex < 0) return;
  clearCine();
  setBehindInert(false);                              // avant de rendre le focus à la vignette
  setCine(false);
  duck(false);
  const back = cards[vIndex];
  const r = back.getBoundingClientRect();
  if (r.width) burst(r.left + r.width / 2, r.top + r.height / 2);
  vIndex = -1;
  viewer.classList.remove('in');
  const frame = back.querySelector('.card-frame');
  const finish = () => {
    document.body.classList.remove('view-open');
    stageBox.innerHTML = '';
    stageBox.classList.remove('loading');
    stageBox.style.backgroundImage = '';
    stageBox.style.viewTransitionName = '';
  };
  if (REDUCED || !document.startViewTransition || document.hidden){
    setTimeout(finish, 280);
  } else {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      finish();
      frame.style.viewTransitionName = 'souvenir';
    };
    let t;
    try { t = document.startViewTransition(go); } catch (e){ go(); }
    setTimeout(go, 400);
    if (t) t.finished.catch(() => {}).finally(() => { frame.style.viewTransitionName = ''; });
    else frame.style.viewTransitionName = '';
  }
  back.focus({ preventScroll: true });
}

function stepViewer(d){
  if (vIndex < 0) return;
  if (showMode && d > 0 && vIndex === MEDIA.length - 1){ endShow(); return; }
  vIndex = (vIndex + d + MEDIA.length) % MEDIA.length;
  goTo(vIndex, true);                      // le défilé suit la visionneuse
  paint(vIndex);
}

function setCine(on){
  cine = on;
  cineBtn.setAttribute('aria-pressed', String(on));
  cineBtn.textContent = on ? '❚❚' : '▶';
  cineBtn.setAttribute('aria-label', on ? 'Arrêter le mode cinéma' : 'Mode cinéma : défilement automatique');
  if (!on){ clearCine(); bar.classList.remove('run'); }
  else armCine(MEDIA[vIndex] && MEDIA[vIndex].type === 'video' ? 'video' : 'photo');
}

cineBtn.addEventListener('click', () => setCine(!cine));
document.getElementById('viewClose').addEventListener('click', closeViewer);
document.getElementById('viewSkip').addEventListener('click', endShow);
document.getElementById('viewPrev').addEventListener('click', () => { if (!showMode) setCine(false); stepViewer(-1); });
document.getElementById('viewNext').addEventListener('click', () => { if (!showMode) setCine(false); stepViewer(1); });
viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target.classList.contains('view-stage')) closeViewer(); });

document.addEventListener('keydown', (e) => {
  if (vIndex < 0) return;
  if (e.key === 'Tab'){ trapFocus(e); }
  else if (e.key === 'Escape'){ closeViewer(); }
  else if (e.key === 'ArrowLeft'){ if (!showMode) setCine(false); stepViewer(-1); }
  else if (e.key === 'ArrowRight'){ if (!showMode) setCine(false); stepViewer(1); }
  else if (e.key === ' '){ e.preventDefault(); setCine(!cine); }
});

let swX = 0, swY = 0;
viewer.addEventListener('touchstart', (e) => {
  swX = e.changedTouches[0].clientX; swY = e.changedTouches[0].clientY;
}, { passive: true });
viewer.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - swX;
  const dy = e.changedTouches[0].clientY - swY;
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)){ if (!showMode) setCine(false); stepViewer(dx < 0 ? 1 : -1); }
  else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeViewer();
}, { passive: true });

/* =========================================================================
   Le spectacle : tous les souvenirs, d'eux-mêmes, puis on rend la main
   ========================================================================= */
function playMemoriesShow(onEnd){
  if (showMode) return;
  revealGallery(false);                     // la galerie doit être mesurée
  showMode = true;
  showEnd = typeof onEnd === 'function' ? onEnd : null;
  document.body.classList.add('show-on');
  if (vIndex >= 0){ showMode = false; closeViewer(); showMode = true; }
  goTo(0, true);
  openViewer(0, cards[0]);
  setCine(true);
}

function endShow(){
  if (!showMode) return;
  const cb = showEnd;
  showMode = false;
  showEnd = null;
  document.body.classList.remove('show-on');
  if (vIndex >= 0) closeViewer();
  if (cb) setTimeout(cb, REDUCED ? 60 : 440);          // on laisse la visionneuse se refermer
}
window.playMemoriesShow = playMemoriesShow;

/* =========================================================================
   Ouverture de la galerie
   ========================================================================= */
let shown = false;
function revealGallery(scrollToIt){
  if (window.revealBirthday) window.revealBirthday(false);   // la carte juste au-dessus
  if (!shown){
    shown = true;
    document.body.classList.add('gallery-on');
    measure(); layout(); kick();
  }
  if (scrollToIt){
    document.getElementById('gallery').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  }
}
window.revealGallery = revealGallery;
document.getElementById('galBtn').addEventListener('click', () => {
  if (/galerie|gallery/.test(location.hash)) revealGallery(true);
  else location.hash = 'galerie';                  // une étape d'historique
});

measure(); layout();

/* Accès direct : index.html#galerie — relu aussi à chaque changement d'adresse */
function applyHash(atLoad){
  if (!/galerie|gallery/.test(location.hash)) return;
  if (atLoad){
    if (BR.settle) BR.settle();                    // l'accueil se range, la lettre s'ouvre
    revealGallery(false);
    requestAnimationFrame(() => document.getElementById('gallery').scrollIntoView());
  } else {
    revealGallery(true);
  }
}
applyHash(true);
window.addEventListener('hashchange', () => applyHash(false));

})();
