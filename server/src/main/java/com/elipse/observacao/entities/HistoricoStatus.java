package com.elipse.observacao.entities;

import com.elipse.observacao.enums.StatusOcorrencia;
import java.time.OffsetDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoStatus {
    private StatusOcorrencia status;
    private OffsetDateTime data;
}
