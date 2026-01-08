<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;

/**
 * Exception for GreenGamePay API errors
 */
class GreenGamePayException extends Exception
{
    protected int $statusCode;

    public function __construct(string $message = '', int $statusCode = 500, ?Exception $previous = null)
    {
        $this->statusCode = $statusCode;
        parent::__construct($message, $statusCode, $previous);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}
