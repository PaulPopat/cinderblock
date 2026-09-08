#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class Access : Instruction
  {
  public:
    Access(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *subject;
    LiteralString *key;
    int end;
  };
}