import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { TrustScoreCredential } from 'src/entities/trust-score.entity';
import { Identifier } from '../entities/identifier.entity';
import { v4 } from 'uuid';

@Injectable()
export class TrustScoreService {
    private readonly logger = new Logger(TrustScoreService.name);

    constructor(
        @InjectRepository(TrustScoreCredential)
        private readonly trustScoreRepository: EntityRepository<TrustScoreCredential>
    ) {}

    updateTrustScore(subjectId: string) {
        this.logger.log(`Updating trust score for: ${subjectId}`);

        // Simulate some logic
        const score = Math.floor(Math.random() * 100);
        const summary = `Auto-computed trust score: ${score}`;

        // You would normally persist to DB here
        this.logger.log(`Trust score updated: ${score}, ${summary}`);
        
    }

    async createTrustScore(identifier: Identifier) {
        const trustScore = new TrustScoreCredential();
        trustScore.factors = [];
        trustScore.id = v4();
        trustScore.identifer = identifier;
        trustScore.score = 0;
        trustScore.summary = "";

        await this.trustScoreRepository.insert(trustScore);
        this.logger.log("Created new Trust Score for user");
    }


    scheduleTrustScoreUpdate(subjectId: string) {
        setTimeout(() => {
            this.updateTrustScore(subjectId);
        }, 2000); 
    }
}
