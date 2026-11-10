package com.elipse.observacao.config;

import org.junit.jupiter.api.Test;
import java.time.OffsetDateTime;
import static org.assertj.core.api.Assertions.assertThat;

class MongoConfigTest {
    @Test
    void devePreservarInstanteDoHistoricoNaConversaoParaDataBson() {
        var original = OffsetDateTime.parse("2026-11-10T09:00:00.123-03:00");
        var gravado = MongoConfig.OffsetDateTimeWriteConverter.INSTANCE.convert(original);
        var lido = MongoConfig.DateReadConverter.INSTANCE.convert(gravado);
        assertThat(lido.toInstant()).isEqualTo(original.toInstant());
        assertThat(lido.getOffset()).isEqualTo(java.time.ZoneOffset.UTC);
    }
}
